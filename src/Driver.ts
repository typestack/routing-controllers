import {HttpError} from "./error/http/HttpError";
import {Utils} from "./util/Utils";
import {UseMetadata} from "./metadata/UseMetadata";
import {MiddlewareMetadata} from "./metadata/MiddlewareMetadata";
import {IncomingMessage, ServerResponse} from "http";
import {BadHttpActionError} from "./error/BadHttpActionError";
import {ParamTypes} from "./metadata/types/ParamTypes";
import {ActionMetadata} from "./metadata/ActionMetadata";
import {ActionCallbackOptions} from "./ActionCallbackOptions";
import {constructorToPlain} from "constructor-utils";

/**
 * Base driver functionality for all other drivers.
 */
export class Driver {

    // -------------------------------------------------------------------------
    // Public Properties
    // -------------------------------------------------------------------------

    /**
     * Indicates if constructor-utils should be used to perform serialization / deserialization.
     */
    useConstructorUtils: boolean;

    /**
     * Indicates if default routing-controller's error handling is enabled or not.
     */
    isDefaultErrorHandlingEnabled: boolean;

    /**
     * Indicates if debug mode is enabled or not. In debug mode additional information may be exposed.
     */
    developmentMode: boolean;

    /**
     * Map of error overrides.
     */
    errorOverridingMap: { [key: string]: any };

    /**
     * Route prefix. eg '/api'
     */
    routePrefix: string = '';

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private express: any) {
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Registers given error handler in the driver.
     */
    registerErrorHandler(middleware: MiddlewareMetadata): void {
        if (!middleware.expressErrorHandlerInstance.error)
            return;

        this.express.use(function (error: any, request: any, response: any, next: Function) {
            middleware.expressErrorHandlerInstance.error(error, request, response, next);
        });
    }

    /**
     * Registers middleware that run before controller actions.
     */
    registerMiddleware(middleware: MiddlewareMetadata): void {
        if (!middleware.expressInstance.use)
            return;

        this.express.use(function (request: any, response: any, next: Function) {
            middleware.expressInstance.use(request, response, next);
        });
    }

    /**
     * Registers action in the driver.
     */
    registerAction(action: ActionMetadata, middlewares: MiddlewareMetadata[], executeCallback: (options: ActionCallbackOptions) => any): void {
        const expressAction = action.type.toLowerCase();
        if (!this.express[expressAction])
            throw new BadHttpActionError(action.type);

        const routeHandler = function(request: IncomingMessage, response: ServerResponse, next: Function) {
            const options: ActionCallbackOptions = {
                request: request,
                response: response,
                next: next
            };
            executeCallback(options);
        };

        const defaultMiddlewares: any[] = [];
        if (action.isCookiesUsed) {
            defaultMiddlewares.push(require("cookie-parser")());
        }
        if (action.isBodyUsed) {
            if (action.isJsonTyped) {
                defaultMiddlewares.push(require("body-parser").json());
            } else {
                defaultMiddlewares.push(require("body-parser").text());
            }
        }
        if (action.isFileUsed || action.isFilesUsed) {
            const multer = require("multer");
            action.params
                .filter(param => param.type === ParamTypes.UPLOADED_FILE)
                .forEach(param => {
                    defaultMiddlewares.push(multer(param.extraOptions).single(param.name));
                });
            action.params
                .filter(param => param.type === ParamTypes.UPLOADED_FILES)
                .forEach(param => {
                    defaultMiddlewares.push(multer(param.extraOptions).array(param.name));
                });
        }

        const uses = action.controllerMetadata.uses.concat(action.uses);
        const fullRoute = action.fullRoute instanceof RegExp ? action.fullRoute : `${this.routePrefix}${action.fullRoute}`;
        const preMiddlewareFunctions = this.registerUses(uses.filter(use => !use.afterAction), middlewares);
        const postMiddlewareFunctions = this.registerUses(uses.filter(use => use.afterAction), middlewares);
        const expressParams: any[] = [fullRoute, ...defaultMiddlewares, ...preMiddlewareFunctions, routeHandler, ...postMiddlewareFunctions];

        // finally register action
        this.express[expressAction](...expressParams);
    }

    /**
     * Gets param from the request.
     */
    getParamFromRequest(actionOptions: ActionCallbackOptions, param: any): void {
        const request: any = actionOptions.request;
        switch (param.type) {
            case ParamTypes.BODY:
                return request.body;
            case ParamTypes.PARAM:
                return request.params[param.name];
            case ParamTypes.QUERY:
                return request.query[param.name];
            case ParamTypes.HEADER:
                return request.headers[param.name.toLowerCase()];
            case ParamTypes.UPLOADED_FILE:
                return request.file;
            case ParamTypes.UPLOADED_FILES:
                return request.files;
            case ParamTypes.BODY_PARAM:
                return request.body[param.name];
            case ParamTypes.COOKIE:
                return request.cookies[param.name];
        }
    }

    /**
     * Defines an algorithm of how to handle success result of executing controller action.
     */
    handleSuccess(result: any, action: ActionMetadata, options: ActionCallbackOptions): void {

        if (this.useConstructorUtils && result && result instanceof Object) {
            result = constructorToPlain(result); // todo: specify option to disable it?
        }

        const response: any = options.response;
        const isResultUndefined = result === undefined;
        const isResultNull = result === null;
        const isResultEmpty = isResultUndefined || isResultNull || result === false || result === "";

        // set http status
        if (action.undefinedResultCode && isResultUndefined) {
            response.status(action.undefinedResultCode);

        } else if (action.nullResultCode && isResultNull) {
            response.status(action.nullResultCode);

        } else if (action.emptyResultCode && isResultEmpty) {
            response.status(action.emptyResultCode);

        } else if (action.successHttpCode) {
            response.status(action.successHttpCode);
        }

        // apply http headers
        Object.keys(action.headers).forEach(name => {
            response.header(name, action.headers[name]);
        });

        if (action.redirect) { // if redirect is set then do it
            response.redirect(action.redirect);
            options.next();

        } else if (action.renderedTemplate) { // if template is set then render it
            const renderOptions = result && result instanceof Object ? result : {};

            this.express.render(action.renderedTemplate, renderOptions, (err: any, html: string) => {
                if (err && action.isJsonTyped) {
                    // response.json(err);
                    return options.next(err);

                } else if (err && !action.isJsonTyped) {
                    // response.send(err);
                    return options.next(err);

                } else if (html) {
                    response.send(html);
                }
                options.next();
            });

        } else if (result !== undefined) { // send regular result
            if (result === null) {
                if (action.isJsonTyped) {
                    response.json();
                } else {
                    response.send();
                }
            } else {
                if (action.isJsonTyped) {
                    response.json(result);
                } else {
                    response.send(String(result));
                }
                options.next();
            }

        } else {
            options.next();
        }
    }

    /**
     * Defines an algorithm of how to handle error during executing controller action.
     */
    handleError(error: any, action: ActionMetadata, options: ActionCallbackOptions): void {
        const response: any = options.response;

        // set http status
        if (error instanceof HttpError && error.httpCode) {
            response.status(error.httpCode);
        } else {
            response.status(500);
        }

        // apply http headers
        Object.keys(action.headers).forEach(name => {
            response.header(name, action.headers[name]);
        });

        // send error content
        if (action.isJsonTyped) {
            response.json(this.processJsonError(error));
        } else {
            response.send(this.processTextError(error)); // todo: no need to do it because express by default does it
        }
        options.next(error);
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    private registerUses(uses: UseMetadata[], middlewares: MiddlewareMetadata[]) {
        const middlewareFunctions: Function[] = [];
        uses.forEach(use => {
            if (use.middleware.prototype.use) { // if this is function instance of ExpressMiddlewareInterface
                middlewares.forEach(middleware => {
                    if (middleware.expressInstance instanceof use.middleware) {
                        middlewareFunctions.push(function(request: IncomingMessage, response: ServerResponse, next: Function) {
                            middleware.expressInstance.use(request, response, next);
                        });
                    }
                });
            } else {
                middlewareFunctions.push(use.middleware);
            }
        });
        return middlewareFunctions;
    }

    private processJsonError(error: any) {
        if (!this.isDefaultErrorHandlingEnabled)
            return error;

        let processedError: any = {};
        if (error instanceof Error) {
            if (error.name && (this.developmentMode || error.message)) // show name only if in debug mode and if error message exist too
                processedError.name = error.name;
            if (error.message)
                processedError.message = error.message;
            if (error.stack && this.developmentMode)
                processedError.stack = error.stack;

            Object.keys(error)
                .filter(key => key !== "stack" && key !== "name" && key !== "message" && (!(error instanceof HttpError) || key !== "httpCode"))
                .forEach(key => processedError[key] = error[key]);

            if (this.errorOverridingMap)
                Object.keys(this.errorOverridingMap)
                    .filter(key => error.name === key)
                    .forEach(key => processedError = Utils.merge(processedError, this.errorOverridingMap[key]));

            return Object.keys(processedError).length > 0 ? processedError : undefined;
        }

        return error;
    }

    private processTextError(error: any) {
        if (!this.isDefaultErrorHandlingEnabled)
            return error;

        if (error instanceof Error) {
            if (this.developmentMode && error.stack) {
                return error.stack;

            } else if (error.message) {
                return error.message;
            }
        }
        return error;
    }

}
