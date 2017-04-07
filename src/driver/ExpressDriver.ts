import {UseMetadata} from "../metadata/UseMetadata";
import {MiddlewareMetadata} from "../metadata/MiddlewareMetadata";
import {BadHttpActionError} from "../error/BadHttpActionError";
import {ActionMetadata} from "../metadata/ActionMetadata";
import {ActionCallbackOptions} from "../ActionCallbackOptions";
import {classToPlain} from "class-transformer";
import {Driver} from "./Driver";
import {ParamMetadata} from "../metadata/ParamMetadata";
import {BaseDriver} from "./BaseDriver";
const cookie = require("cookie");

/**
 * Base driver functionality for all other drivers.
 */
export class ExpressDriver extends BaseDriver implements Driver {

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
        if (!middleware.errorHandlerInstance.error)
            return;

        this.express.use(function (error: any, request: any, response: any, next: (err?: any) => any) {
            middleware.errorHandlerInstance.error(error, request, response, next);
        });
    }

    /**
     * Registers middleware that run before controller actions.
     */
    registerMiddleware(middleware: MiddlewareMetadata): void {
        if (!middleware.instance.use)
            return;

        this.express.use((request: any, response: any, next: (err: any) => any) => {
            try {
                const useResult = middleware.instance.use(request, response, next);
                if (useResult instanceof Promise) {
                    useResult.catch((error: any) => {
                        this.handleError(error, undefined, {
                            request: request,
                            response: response,
                            next: next,
                        });
                    });
                }

            } catch (error) {
                this.handleError(error, undefined, {
                    request: request,
                    response: response,
                    next: next,
                });
            }
        });
    }

    /**
     * Registers action in the driver.
     */
    registerAction(action: ActionMetadata,
                   middlewares: MiddlewareMetadata[],
                   executeCallback: (options: ActionCallbackOptions) => any): void {
        const expressAction = action.type.toLowerCase();
        if (!this.express[expressAction])
            throw new BadHttpActionError(action.type);

        const routeHandler = function RouteHandler(request: any, response: any, next: Function) {
            const options: ActionCallbackOptions = {
                request: request,
                response: response,
                next: next,
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
                .filter(param => param.type === "file")
                .forEach(param => {
                    defaultMiddlewares.push(multer(param.extraOptions).single(param.name));
                });
            action.params
                .filter(param => param.type === "files")
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
            case "body":
                if (param.name)
                    return request.body[param.name];
                return request.body;

            case "param":
                if (param.name)
                    return request.params[param.name];
                return request.params;

            case "session":
                if (param.name)
                    return request.session[param.name]; 
                return request.session;

            case "state":
                throw new Error("@State decorators are not supported by ExpressDriver yet.");
            case "query":
                if (param.name)
                    return request.query[param.name];

                return request.query;
            case "header":
                if (param.name)
                    return request.headers[param.name.toLowerCase()];

                return request.headers;
            case "file":
                return request.file;

            case "files":
                return request.files;

            case "cookie":
                if (!request.headers.cookie) return;
                const cookies = cookie.parse(request.headers.cookie);
                if (param.name)
                    return cookies[param.name];
                return cookies;
        }
    }

    /**
     * Defines an algorithm of how to handle success result of executing controller action.
     */
    handleSuccess(result: any, action: ActionMetadata, options: ActionCallbackOptions): void {
        if (this.useClassTransformer && result && result instanceof Object) {
            const options = action.responseClassTransformOptions || this.classToPlainTransformOptions;
            result = classToPlain(result, options);
        }

        // set http status
        if (action.undefinedResultCode && result === undefined) {
            options.response.status(action.undefinedResultCode);

        } else if (action.nullResultCode && result === null) {
            options.response.status(action.nullResultCode);

        } else if (action.successHttpCode) {
            options.response.status(action.successHttpCode);
        }

        // apply http headers
        Object.keys(action.headers).forEach(name => {
            options.response.header(name, action.headers[name]);
        });

        if (action.redirect) { // if redirect is set then do it
            options.response.redirect(action.redirect);
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
                    options.response.send(html);
                }
                options.next();
            });

        } else if (result !== undefined || action.undefinedResultCode) { // send regular result
            if (result === null || (result === undefined && action.undefinedResultCode)) {
                if (result === null && !action.nullResultCode) {
                    options.response.status(204);
                }

                if (action.isJsonTyped) {
                    options.response.json();
                } else {
                    options.response.send();
                }
                options.next();
            } else {
                if (action.isJsonTyped) {
                    options.response.json(result);
                } else {
                    options.response.send(String(result));
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
    handleError(error: any, action: ActionMetadata|undefined, options: ActionCallbackOptions): void {
        if (this.isDefaultErrorHandlingEnabled) {
            const response: any = options.response;

            // set http code
            // note that we can't use error instanceof HttpError properly anymore because of new typescript emit process
            if (error.httpCode) {
                response.status(error.httpCode);
            } else {
                response.status(500);
            }

            // apply http headers
            if (action) {
                Object.keys(action.headers).forEach(name => {
                    response.header(name, action.headers[name]);
                });
            }

            // send error content
            if (action && action.isJsonTyped) {
                response.json(this.processJsonError(error));
            } else {
                response.send(this.processTextError(error)); // todo: no need to do it because express by default does it
            }
        }
        options.next(error);
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    private registerUses(uses: UseMetadata[], middlewares: MiddlewareMetadata[]) {
        const middlewareFunctions: Function[] = [];
        uses.forEach(use => {
            if (use.middleware.prototype && use.middleware.prototype.use) { // if this is function instance of MiddlewareInterface
                middlewares.forEach(middleware => {
                    if (middleware.instance instanceof use.middleware) {
                        middlewareFunctions.push(function (request: any, response: any, next: (err: any) => any) {
                            return middleware.instance.use(request, response, next);
                        });
                    }
                });
            } else if (use.middleware.prototype && use.middleware.prototype.error) {  // if this is function instance of ErrorMiddlewareInterface
                middlewares.forEach(middleware => {
                    if (middleware.errorHandlerInstance instanceof use.middleware) {
                        middlewareFunctions.push(function (error: any, request: any, response: any, next: (err: any) => any) {
                            return middleware.errorHandlerInstance.error(error, request, response, next);
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
