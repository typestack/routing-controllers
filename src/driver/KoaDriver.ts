import {ActionProperties} from "../ActionProperties";
import {ActionMetadata} from "../metadata/ActionMetadata";
import {BaseDriver} from "./BaseDriver";
import {Driver} from "./Driver";
import {MiddlewareMetadata} from "../metadata/MiddlewareMetadata";
import {ParamMetadata} from "../metadata/ParamMetadata";
import {UseMetadata} from "../metadata/UseMetadata";
import {classToPlain} from "class-transformer";
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

    /**
     * Initializes the things driver needs before routes and middleware registration.
     */
    initialize() {
        const bodyParser = require("koa-bodyparser");
        this.koa.use(bodyParser());
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
                   executeCallback: (options: ActionProperties) => any): void {
        const koaAction = action.type.toLowerCase();
        const defaultMiddlewares: any[] = [];
        if (action.isBodyUsed) {
            if (action.isJsonTyped) {
                // defaultMiddlewares.push(require("koa-body-parser")());
            } else {
                // defaultMiddlewares.push(require("koa-body-parser")());
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
        const preMiddlewareFunctions = this.registerUses(uses.filter(use => !use.afterAction), middlewares);
        const postMiddlewareFunctions = this.registerUses(uses.filter(use => use.afterAction), middlewares);

        const routeHandler = (ctx: any, next: () => Promise<any>) => {
            return new Promise((resolve, reject) => {
                const options: ActionProperties = {
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

    /**
     * Registers all routes in the framework.
     */
    registerRoutes() {
        this.koa.use(this.router.routes());
        this.koa.use(this.router.allowedMethods());
    }

    getParamFromRequest(actionOptions: ActionProperties, param: ParamMetadata): any {
        const context = actionOptions.context;
        const request: any = actionOptions.request;
        switch (param.type) {
            case "body":
                if (param.name)
                    return request.body[param.name];
                return request.body;

            case "param":
                if (param.name)
                    return context.params[param.name];
                return context.params;

            case "session":
                if (param.name)
                    return context.session[param.name]; 
                return context.session;

            case "state":
                if (param.name)
                    return context.state[param.name];
                return context.state;

            case "query":
                if (param.name)
                    return context.query[param.name];
                return context.query;

            case "file":
                return actionOptions.context.req.file;

            case "files":
                return actionOptions.context.req.files;

            case "header":
                if (param.name)
                    return context.headers[param.name.toLowerCase()];
                return context.headers;

            case "cookie":
                if (!context.headers.cookie) return;
                const cookies = cookie.parse(context.headers.cookie);
                if (param.name)
                    return cookies[param.name];
                return cookies;
        }
    }

    handleSuccess(result: any, action: ActionMetadata, options: ActionProperties): void {

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
            });

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

                } else if (result === undefined && action.undefinedResultCode) {
                    response.status = action.undefinedResultCode;
                }

                options.next();
            } else {
                if (result instanceof Object) {
                    response.body = result;
                } else {
                    response.body = result;
                }
                options.next();
            }
            // options.resolver();

        } else {
            options.next();
            // options.resolver();
        }
    }

    handleError(error: any, action: ActionMetadata, options: ActionProperties): void {
        if (this.isDefaultErrorHandlingEnabled) {
            const response: any = options.response;

            // set http status
            // note that we can't use error instanceof HttpError properly anymore because of new typescript emit process
            if (error.httpCode) {
                options.context.status = error.httpCode;
                response.status = error.httpCode;
            } else {
                options.context.status = 500;
                response.status = 500;
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

    private loadMulter() {
        try {
            return require("koa-multer");
        } catch (e) {
            throw new Error("koa-multer package was not found installed. Try to install it: npm install koa-multer --save");
        }
    }

}