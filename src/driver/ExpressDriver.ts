import {HttpError} from "../error/http/HttpError";
import {Utils} from "../util/Utils";
import {UseMetadata} from "../metadata/UseMetadata";
import {MiddlewareMetadata} from "../metadata/MiddlewareMetadata";
import {IncomingMessage, ServerResponse} from "http";
import {BadHttpActionError} from "../error/BadHttpActionError";
import {ParamTypes} from "../metadata/types/ParamTypes";
import {ActionMetadata} from "../metadata/ActionMetadata";
import {ActionCallbackOptions} from "../ActionCallbackOptions";
import {constructorToPlain} from "constructor-utils";
import {Driver} from "./Driver";
import {ParamMetadata} from "../metadata/ParamMetadata";
import {BaseDriver} from "./BaseDriver";
const cookie = require("cookie");

/**
 * Base driver functionality for all other drivers.
 */
export class ExpressDriver extends BaseDriver implements Driver {

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
    routePrefix: string = "";

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(public express?: any) {
        super();
        if (require) {
            if (!express) {
                try {
                    this.express = require("express")();
                } catch (e) {
                    throw new Error("express package was not found installed. Try to install it: npm install express --save");
                }
            }
        } else {
            throw new Error("Cannot load express. Try to install all required dependencies.");
        }
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    bootstrap() {
    }
    
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
        if (!middleware.instance.use)
            return;

        this.express.use(function (request: any, response: any, next: Function) {
            middleware.instance.use(request, response, next);
        });
    }

    /**
     * Registers action in the driver.
     */
    registerAction(action: ActionMetadata, middlewares: MiddlewareMetadata[], executeCallback: (options: ActionCallbackOptions) => any): void {
        const expressAction = action.type.toLowerCase();
        if (!this.express[expressAction])
            throw new BadHttpActionError(action.type);

        const routeHandler = function RouteHandler(request: IncomingMessage, response: ServerResponse, next: Function) {
            const options: ActionCallbackOptions = {
                request: request,
                response: response,
                next: next
            };
            executeCallback(options);
        };

        const defaultMiddlewares: any[] = [];
        if (action.isBodyUsed) {
            if (action.isJsonTyped) {
                defaultMiddlewares.push(this.loadBodyParser().json());
            } else {
                defaultMiddlewares.push(this.loadBodyParser().text());
            }
        }
        if (action.isFileUsed || action.isFilesUsed) {
            const multer = this.loadMulter();
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
        const fullRoute = action.fullRoute instanceof RegExp
            ? ActionMetadata.appendBaseRouteToRegexpRoute(action.fullRoute as RegExp, this.routePrefix) 
            : `${this.routePrefix}${action.fullRoute}`;
        const preMiddlewareFunctions = this.registerUses(uses.filter(use => !use.afterAction), middlewares);
        const postMiddlewareFunctions = this.registerUses(uses.filter(use => use.afterAction), middlewares);
        const expressParams: any[] = [fullRoute, ...preMiddlewareFunctions, ...defaultMiddlewares, routeHandler, ...postMiddlewareFunctions];

        // finally register action
        this.express[expressAction](...expressParams);
    }

    registerRoutes() {
    }
    
    /**
     * Gets param from the request.
     */
    getParamFromRequest(actionOptions: ActionCallbackOptions, param: ParamMetadata): void {
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
                if (!request.headers.cookie) return;
                const cookies = cookie.parse(request.headers.cookie);
                return cookies[param.name];
        }
    }

    /**
     * Defines an algorithm of how to handle success result of executing controller action.
     */
    handleSuccess(result: any, action: ActionMetadata, options: ActionCallbackOptions): void {

        if (this.useConstructorUtils && result && result instanceof Object) {
            result = constructorToPlain(result);
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

        } else if (result !== undefined || action.undefinedResultCode) { // send regular result
            if (result === null || (result === undefined && action.undefinedResultCode)) {
                if (result === null && !action.nullResultCode && !action.emptyResultCode) {
                    response.status(204);
                }
                
                if (action.isJsonTyped) {
                    response.json();
                } else {
                    response.send();
                }
                options.next();
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
                    if (middleware.instance instanceof use.middleware) {
                        middlewareFunctions.push(function(request: IncomingMessage, response: ServerResponse, next: Function) {
                            return middleware.instance.use(request, response, next);
                        });
                    }
                });
            } else {
                middlewareFunctions.push(use.middleware);
            }
        });
        return middlewareFunctions;
    }

    private loadBodyParser() {
        try {
            return require("body-parser");
        } catch (e) {
            throw new Error("body-parser package was not found installed. Try to install it: npm install body-parser --save");
        }
    }

    private loadMulter() {
        try {
            return require("multer");
        } catch (e) {
            throw new Error("multer package was not found installed. Try to install it: npm install multer --save");
        }
    }

}
