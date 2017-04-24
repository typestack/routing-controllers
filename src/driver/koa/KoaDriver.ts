import {ActionProperties} from "../../ActionProperties";
import {ActionMetadata} from "../../metadata/ActionMetadata";
import {BaseDriver} from "../BaseDriver";
import {Driver} from "../Driver";
import {MiddlewareMetadata} from "../../metadata/MiddlewareMetadata";
import {ParamMetadata} from "../../metadata/ParamMetadata";
import {UseMetadata} from "../../metadata/UseMetadata";
import {classToPlain} from "class-transformer";
import {KoaMiddlewareInterface} from "./KoaMiddlewareInterface";
const cookie = require("cookie");

/**
 * Integration with koa framework.
 */
export class KoaDriver extends BaseDriver implements Driver {

    // -------------------------------------------------------------------------
    // Private Properties
    // -------------------------------------------------------------------------

    /**
     * Koa-router module.
     */
    private router: any;
    
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(public koa?: any) {
        super();
        this.loadKoa();
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

    /**
     * Registers middleware that run before controller actions.
     */
    registerMiddleware(middleware: MiddlewareMetadata): void {
        if ((middleware.instance as KoaMiddlewareInterface).use) {
            this.koa.use(function (ctx: any, next: any) {
                return (middleware.instance as KoaMiddlewareInterface).use(ctx, next);
            });
        }
    }

    /**
     * Registers action in the driver.
     */
    registerAction(action: ActionMetadata,
                   middlewares: MiddlewareMetadata[],
                   executeCallback: (options: ActionProperties) => any): void {

        // middlewares required for this action
        const defaultMiddlewares: any[] = [];
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

        // user used middlewares
        const uses = action.controllerMetadata.uses.concat(action.uses);
        const preMiddlewareFunctions = this.prepareMiddlewares(uses.filter(use => !use.afterAction), middlewares);
        const postMiddlewareFunctions = this.prepareMiddlewares(uses.filter(use => use.afterAction), middlewares);

        // prepare route and route handler function
        const route = ActionMetadata.appendBaseRoute(this.routePrefix, action.fullRoute);
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

        // finally register action in koa
        this.router[action.type.toLowerCase()](...[
            route,
            ...preMiddlewareFunctions,
            ...defaultMiddlewares,
            routeHandler,
            ...postMiddlewareFunctions
        ]);
    }

    /**
     * Registers all routes in the framework.
     */
    registerRoutes() {
        this.koa.use(this.router.routes());
        this.koa.use(this.router.allowedMethods());
    }

    /**
     * Gets param from the request.
     */
    getParamFromRequest(actionOptions: ActionProperties, param: ParamMetadata): any {
        const context = actionOptions.context;
        const request: any = actionOptions.request;
        switch (param.type) {
            case "body":
                return request.body;

            case "body-param":
                return request.body[param.name];

            case "param":
                return context.params[param.name];

            case "params":
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
                return context.query[param.name];

            case "queries":
                return context.query;

            case "file":
                return actionOptions.context.req.file;

            case "files":
                return actionOptions.context.req.files;

            case "header":
                return context.headers[param.name.toLowerCase()];

            case "headers":
                return request.headers;

            case "cookie":
                if (!context.headers.cookie) return;
                const cookies = cookie.parse(context.headers.cookie);
                return cookies[param.name];

            case "cookies":
                if (!request.headers.cookie) return {};
                return cookie.parse(request.headers.cookie);
        }
    }

    /**
     * Handles result of successfully executed controller action.
     */
    handleSuccess(result: any, action: ActionMetadata, options: ActionProperties): void {

        // check if we need to transform result and do it
        if (this.useClassTransformer && result && result instanceof Object) {
            const options = action.responseClassTransformOptions || this.classToPlainTransformOptions;
            result = classToPlain(result, options);
        }

        // set http status code
        if (action.undefinedResultCode && result === undefined) {
            options.response.status = action.undefinedResultCode;

        } else if (action.nullResultCode && result === null) {
            options.response.status = action.nullResultCode;

        } else if (action.successHttpCode) {
            options.response.status = action.successHttpCode;
        }

        // apply http headers
        Object.keys(action.headers).forEach(name => {
            options.response.set(name, action.headers[name]);
        });

        if (action.redirect) { // if redirect is set then do it
            options.response.redirect(action.redirect);
            options.next();

        } else if (action.renderedTemplate) { // if template is set then render it // todo: not working in koa
            const renderOptions = result && result instanceof Object ? result : {};

            this.koa.use(async function (ctx: any, next: any) {
                await ctx.render(action.renderedTemplate, renderOptions);
            });

            options.next();

        } else if (result !== undefined || action.undefinedResultCode) { // send regular result
            if (result === null || (result === undefined && action.undefinedResultCode)) {

                if (action.isJsonTyped) {
                    options.response.body = null;
                } else {
                    options.response.body = null;
                }

                // todo: duplication. we make it here because after we set null to body koa seems overrides status
                if (action.nullResultCode) {
                    options.response.status = action.nullResultCode;

                } else if (result === undefined && action.undefinedResultCode) {
                    options.response.status = action.undefinedResultCode;
                }

                options.next();
            } else {
                if (result instanceof Object) {
                    options.response.body = result;
                } else {
                    options.response.body = result;
                }
                options.next();
            }

        } else {
            options.next();
        }
    }

    /**
     * Handles result of failed executed controller action.
     */
    handleError(error: any, action: ActionMetadata|undefined, options: ActionProperties): void {
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
            if (action) {
                Object.keys(action.headers).forEach(name => {
                    response.set(name, action.headers[name]);
                });
            }

            // send error content
            if (action && action.isJsonTyped) {
                response.body = this.processJsonError(error);
            } else {
                response.body = this.processJsonError(error);
            }
        }
        options.next(error);
    }

    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------

    /**
     * Creates middlewares from the given "use"-s.
     */
    protected prepareMiddlewares(uses: UseMetadata[], middlewares: MiddlewareMetadata[]) {
        const middlewareFunctions: Function[] = [];
        uses.forEach(use => {
            if (use.middleware.prototype && use.middleware.prototype.use) { // if this is function instance of MiddlewareInterface
                middlewares.forEach(middleware => {
                    if (middleware.instance instanceof use.middleware) {
                        middlewareFunctions.push(function(context: any, next: (err?: any) => Promise<any>) {
                            return (middleware.instance as KoaMiddlewareInterface).use(context, next);
                        });
                    }
                });

            } else {
                middlewareFunctions.push(use.middleware);
            }
        });
        return middlewareFunctions;
    }

    /**
     * Dynamically loads koa and required koa-router module.
     */
    protected loadKoa() {
        if (require) {
            if (!this.koa) {
                try {
                    this.koa = new (require("koa"))();
                } catch (e) {
                    throw new Error("koa package was not found installed. Try to install it: npm install koa@next --save");
                }

                this.loadRouter();
            }
        } else {
            throw new Error("Cannot load koa. Try to install all required dependencies.");
        }
    }

    /**
     * Dynamically loads koa-router module.
     */
    private loadRouter() {
        try {
            this.router = new (require("koa-router"))();
        } catch (e) {
            throw new Error("koa-router package was not found installed. Try to install it: npm install koa-router@next --save");
        }
    }

    /**
     * Dynamically loads koa-multer module.
     */
    private loadMulter() {
        try {
            return require("koa-multer");
        } catch (e) {
            throw new Error("koa-multer package was not found installed. Try to install it: npm install koa-multer --save");
        }
    }

}