import {ParamTypes} from "../metadata/types/ParamTypes";
import {ActionMetadata} from "../metadata/ActionMetadata";
import {HttpError} from "../error/http/HttpError";
import {MiddlewareMetadata} from "../metadata/MiddlewareMetadata";
import {ActionCallbackOptions} from "../ActionCallbackOptions";
import {BaseDriver} from "./BaseDriver";
import {classToPlain} from "class-transformer";
import {BadHttpActionError} from "../error/BadHttpActionError";
import {Driver} from "./Driver";
import {UseMetadata} from "../metadata/UseMetadata";
import {ParamMetadata} from "../metadata/ParamMetadata";
import {InterceptorMetadata} from "../metadata/InterceptorMetadata";
import {UseInterceptorMetadata} from "../metadata/UseInterceptorMetadata";
import {PromiseUtils} from "../util/PromiseUtils";
const cookie = require("cookie");

/**
 * Integration with koa framework.
 */
export class KoaDriver extends BaseDriver implements Driver {

    // -------------------------------------------------------------------------
    // Private Properties
    // -------------------------------------------------------------------------

    private router: any;
    
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(public koa?: any) {
        super();
        
        if (require) {
            if (!koa) {
                try {
                    this.koa = new (require("koa"))();
                } catch (e) {
                    throw new Error("koa package was not found installed. Try to install it: npm install koa@next --save");
                }
            }
            try {
                this.router = new (require("koa-router"))();
            } catch (e) {
                throw new Error("koa-router package was not found installed. Try to install it: npm install koa-router@next --save");
            }
        } else {
            throw new Error("Cannot load koa. Try to install all required dependencies.");
        }

    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    bootstrap() {
        const bodyParser = require("koa-bodyparser");
        this.koa.use(bodyParser());
    }
    
    registerErrorHandler(middleware: MiddlewareMetadata): void {
    }

    registerMiddleware(middleware: MiddlewareMetadata): void {
        if (!middleware.instance.use)
            return;
        
        this.koa.use(function (ctx: any, next: any) {
            return middleware.instance.use(ctx, next);
        });
    }

    registerAction(action: ActionMetadata,
                   middlewares: MiddlewareMetadata[],
                   interceptors: InterceptorMetadata[],
                   executeCallback: (options: ActionCallbackOptions) => any): void {
        const koaAction = action.type.toLowerCase();
        if (!this.router[koaAction])
            throw new BadHttpActionError(action.type);

        const useInterceptors = action.controllerMetadata.useInterceptors.concat(action.useInterceptors);
        const useInterceptorFunctions = this.registerIntercepts(useInterceptors, interceptors);
        const globalUseInterceptors: Function[] = interceptors
            .filter(interceptor => interceptor.isGlobal)
            .sort((interceptor1, interceptor2) => interceptor1.priority - interceptor2.priority)
            .reverse()
            .map(interceptor => {
                return function (request: any, response: any, result: any) {
                    return interceptor.instance.intercept(request, response, result);
                };
            });

        const defaultMiddlewares: any[] = [];
        if (action.isBodyUsed) {
            if (action.isJsonTyped) {
                // defaultMiddlewares.push(require("koa-body-parser")());
            } else {
                // defaultMiddlewares.push(require("koa-body-parser")());
            }
        }
        // file uploading is not working yet. need to implement it
        /*if (action.isFileUsed || action.isFilesUsed) {
            // todo: not implemented yet
            const multer = require("koa-router-multer");
            action.params
                .filter(param => param.type === ParamTypes.UPLOADED_FILE)
                .forEach(param => {
                    defaultMiddlewares.push(multer({ dest: "uploads/" }).single(param.name));
                });
            action.params
                .filter(param => param.type === ParamTypes.UPLOADED_FILES)
                .forEach(param => {
                    defaultMiddlewares.push(multer(param.extraOptions).array(param.name));
                });
        }*/

        const uses = action.controllerMetadata.uses.concat(action.uses);
        const preMiddlewareFunctions = this.registerUses(uses.filter(use => !use.afterAction), middlewares);
        const postMiddlewareFunctions = this.registerUses(uses.filter(use => use.afterAction), middlewares);

        const routeHandler = (ctx: any, next: () => Promise<any>) => {
            return new Promise((resolve, reject) => {
                const options: ActionCallbackOptions = {
                    request: ctx.request,
                    response: ctx.response,
                    next: (err: any) => {
                        next().then(r => {
                            if (err && !this.isDefaultErrorHandlingEnabled) {
                                return reject(err);
                            }
                            resolve(r);
                        }).catch(reject);
                    },
                    context: ctx,
                    useInterceptorFunctions: globalUseInterceptors.concat(useInterceptorFunctions)
                };
                executeCallback(options);
            });
        };

        const fullRoute = action.fullRoute instanceof RegExp
            ? ActionMetadata.appendBaseRouteToRegexpRoute(action.fullRoute as RegExp, this.routePrefix)
            : `${this.routePrefix}${action.fullRoute}`;
        const routerParams: any[] = [fullRoute, ...preMiddlewareFunctions, ...defaultMiddlewares, routeHandler, ...postMiddlewareFunctions];
        this.router[koaAction](...routerParams);
    }
    
    registerRoutes() {
        this.koa.use(this.router.routes());
        this.koa.use(this.router.allowedMethods());
    }

    getParamFromRequest(actionOptions: ActionCallbackOptions, param: ParamMetadata): void {
        const context = actionOptions.context;
        const request: any = actionOptions.request;
        switch (param.type) {
            case ParamTypes.BODY:
                return request.body;
            case ParamTypes.PARAM:
                return context.params[param.name];
            case ParamTypes.SESSION:
                throw new Error("@Session decorator is not supported by KoaDriver yet.");
                // TODO return session
            case ParamTypes.QUERY:
                return context.query[param.name];
            case ParamTypes.UPLOADED_FILE:
                throw new Error("@UploadedFile and @UploadedFiles decorators are not supported by KoaDriver yet.");
                // return actionOptions.context.req.file;
            case ParamTypes.UPLOADED_FILES:
                throw new Error("@UploadedFile and @UploadedFiles decorators are not supported by KoaDriver yet.");
                // return actionOptions.context.req.files;
            case ParamTypes.HEADER:
                return context.headers[param.name.toLowerCase()];
            case ParamTypes.BODY_PARAM:
                return request.body[param.name];
            case ParamTypes.COOKIE:
                if (!context.headers.cookie) return;
                const cookies = cookie.parse(context.headers.cookie);
                return cookies[param.name];
        }
    }

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
            response.status = action.undefinedResultCode;

        } else if (action.nullResultCode && isResultNull) {
            response.status = action.nullResultCode;

        } else if (action.emptyResultCode && isResultEmpty) {
            response.status = action.emptyResultCode;

        } else if (action.successHttpCode) {
            response.status = action.successHttpCode;
        }

        // apply http headers
        Object.keys(action.headers).forEach(name => {
            response.set(name, action.headers[name]);
        });

        if (action.redirect) { // if redirect is set then do it
            response.redirect(action.redirect);
            options.next();
            // options.resolver();

        } else if (action.renderedTemplate) { // if template is set then render it // todo: not working in koa
            const renderOptions = result && result instanceof Object ? result : {};

            this.koa.use(async function (ctx: any, next: any) {
                await ctx.render(action.renderedTemplate, renderOptions);
            })

            options.next();
        } else if (result !== undefined || action.undefinedResultCode) { // send regular result
            if (result === null || (result === undefined && action.undefinedResultCode)) {

                if (action.isJsonTyped) {
                    response.body = null;
                } else {
                    response.body = null;
                }

                // todo: duplication. we make it here because after we set null to body koa seems overrides status
                if (action.nullResultCode) {
                    response.status = action.nullResultCode;

                } else if (action.emptyResultCode) {
                    response.status = action.emptyResultCode;

                } else if (result === undefined && action.undefinedResultCode) {
                    response.status = action.undefinedResultCode;
                }

                options.next();
            } else {
                if (action.isJsonTyped) {
                    response.body = result;
                } else {
                    response.body = String(result);
                }
                options.next();
            }
            // options.resolver();

        } else {
            options.next();
            // options.resolver();
        }
    }

    handleError(error: any, action: ActionMetadata, options: ActionCallbackOptions): void {
        if (this.isDefaultErrorHandlingEnabled) {
            const response: any = options.response;

            // set http status
            if (error instanceof HttpError && error.httpCode) {
                options.context.status = error.httpCode;
                response.status(error.httpCode);
            } else {
                options.context.status = 500;
                // TODO: FIX response.status(500);
            }

            // apply http headers
            Object.keys(action.headers).forEach(name => {
                response.set(name, action.headers[name]);
            });

            // send error content
            if (action.isJsonTyped) {
                response.body = this.processJsonError(error);
            } else {
                response.body = this.processJsonError(error);
            }
        }
        options.next(error);
        // throw error;
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    private registerIntercepts(useInterceptors: UseInterceptorMetadata[], interceptors: InterceptorMetadata[]) {
        const interceptFunctions: Function[] = [];
        useInterceptors.forEach(useInterceptor => {
            if (useInterceptor.interceptor.prototype && useInterceptor.interceptor.prototype.intercept) { // if this is function instance of MiddlewareInterface
                interceptors.forEach(interceptor => {
                    if (interceptor.instance instanceof useInterceptor.interceptor) {
                        interceptFunctions.push(function (request: any, response: any, result: any) {
                            return interceptor.instance.intercept(request, response, result);
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
                    if (middleware.instance instanceof use.middleware) {
                        middlewareFunctions.push(function(context: any, next: Function) {
                            return middleware.instance.use(context, next);
                        });
                    }
                });

            } else {
                middlewareFunctions.push(use.middleware);
            }
        });
        return middlewareFunctions;
    }

}