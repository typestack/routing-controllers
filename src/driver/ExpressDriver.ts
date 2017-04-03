import {HttpError} from "../http-error/HttpError";
import {UseMetadata} from "../metadata/UseMetadata";
import {MiddlewareMetadata} from "../metadata/MiddlewareMetadata";
import {BadHttpActionError} from "../error/BadHttpActionError";
import {ParamTypes} from "../metadata/types/ParamTypes";
import {ActionMetadata} from "../metadata/ActionMetadata";
import {ActionCallbackOptions} from "../ActionCallbackOptions";
import {classToPlain, ClassTransformOptions} from "class-transformer";
import {Driver} from "./Driver";
import {ParamMetadata} from "../metadata/ParamMetadata";
import {BaseDriver} from "./BaseDriver";
import {InterceptorMetadata} from "../metadata/InterceptorMetadata";
import {UseInterceptorMetadata} from "../metadata/UseInterceptorMetadata";
import {PromiseUtils} from "../util/PromiseUtils";
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
        const instance = middleware.instance;
        if (!instance.use)
            return;

        this.express.use((request: any, response: any, next: (err: any) => any) => {
            try {
                const useResult = instance.use(request, response, next);
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
                   interceptors: InterceptorMetadata[],
                   executeCallback: (options: ActionCallbackOptions) => any): void {
        const expressAction = action.type.toLowerCase();
        if (!this.express[expressAction])
            throw new BadHttpActionError(action.type);

        const useInterceptors = action.controllerMetadata.useInterceptors.concat(action.useInterceptors);
        const useInterceptorFunctions = this.registerIntercepts(useInterceptors, interceptors);
        const globalUseInterceptors: Function[] = interceptors
            .filter(interceptor => interceptor.isGlobal)
            .sort((interceptor1, interceptor2) => interceptor1.priority - interceptor2.priority)
            .reverse()
            .map(interceptor => {
                const instance = interceptor.instance;
                return function (request: any, response: any, result: any) {
                    return instance.intercept(request, response, result);
                };
            });

        const routeHandler = function RouteHandler(request: any, response: any, next: Function) {
            const options: ActionCallbackOptions = {
                request: request,
                response: response,
                next: next,
                useInterceptorFunctions: globalUseInterceptors.concat(useInterceptorFunctions)
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
            case ParamTypes.SESSION:
                if (param.name) {
                    return request.session[param.name]; 
                } else {
                    return request.session;
                }
            case ParamTypes.STATE:
                throw new Error("@State decorators are not supported by ExpressDriver yet.");
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
        if (this.useClassTransformer && result && result instanceof Object) {
            const options = action.responseClassTransformOptions || this.classToPlainTransformOptions;
            result = classToPlain(result, options);
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

    private registerIntercepts(useInterceptors: UseInterceptorMetadata[], interceptors: InterceptorMetadata[]) {
        const interceptFunctions: Function[] = [];
        useInterceptors.forEach(useInterceptor => {
            if (useInterceptor.interceptor.prototype && useInterceptor.interceptor.prototype.intercept) { // if this is function instance of MiddlewareInterface
                interceptors.forEach(interceptor => {
                    const instance = interceptor.instance;
                    if (interceptor.instance instanceof useInterceptor.interceptor) {
                        interceptFunctions.push(function (request: any, response: any, result: any) {
                            return instance.intercept(request, response, result);
                        });
                    }
                });

            } else {
                interceptFunctions.push(useInterceptor.interceptor);
            }
        });
        return interceptFunctions;
    }

    private registerUses(uses: UseMetadata[], middlewares: MiddlewareMetadata[]) {
        const middlewareFunctions: Function[] = [];
        uses.forEach(use => {
            if (use.middleware.prototype && use.middleware.prototype.use) { // if this is function instance of MiddlewareInterface
                middlewares.forEach(middleware => {
                    const instance = middleware.instance;
                    if (instance instanceof use.middleware) {
                        middlewareFunctions.push(function (request: any, response: any, next: (err: any) => any) {
                            return instance.use(request, response, next);
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
