import {ParamTypes} from "../metadata/types/ParamTypes";
import {ActionMetadata} from "../metadata/ActionMetadata";
import {HttpError} from "../error/http/HttpError";
import {MiddlewareMetadata} from "../metadata/MiddlewareMetadata";
import {ActionCallbackOptions} from "../ActionCallbackOptions";
import {BaseDriver} from "./BaseDriver";
import {constructorToPlain} from "constructor-utils/index";
import {BadHttpActionError} from "../error/BadHttpActionError";
import {Driver} from "./Driver";
import {UseMetadata} from "../metadata/UseMetadata";
const cookie = require("cookie");

/**
 * Integration with koa framework.
 */
export class KoaDriver extends BaseDriver implements Driver {

    // -------------------------------------------------------------------------
    // Properties
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
        const bodyParser = require("koa-body-parser");
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

    registerAction(action: ActionMetadata, middlewares: MiddlewareMetadata[], executeCallback: (options: ActionCallbackOptions) => any): void {
        const koaAction = action.type.toLowerCase();
        if (!this.router[koaAction])
            throw new BadHttpActionError(action.type);

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
                    context: ctx
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

    getParamFromRequest(actionOptions: ActionCallbackOptions, param: any): void {
        const context = actionOptions.context;
        const request: any = actionOptions.request;
        switch (param.type) {
            case ParamTypes.BODY:
                return request.body;
            case ParamTypes.PARAM:
                return context.params[param.name];
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

        if (this.useConstructorUtils && result && result instanceof Object) {
            result = constructorToPlain(result);
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

            this.koa.render(action.renderedTemplate, renderOptions, (err: any, html: string) => {
                if (err && action.isJsonTyped) {
                    options.next(err);
                    // options.rejecter(err);

                } else if (err && !action.isJsonTyped) {
                    options.next(err);
                    // options.rejecter(err);

                } else if (html) {
                    response.body = html;
                }
                options.next();
                // options.resolver();
            });

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
        options.next(error);
        // throw error;
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    private registerUses(uses: UseMetadata[], middlewares: MiddlewareMetadata[]) {
        const middlewareFunctions: Function[] = [];
        uses.forEach(use => {
            if (use.middleware.prototype.use) { // if this is function instance of MiddlewareInterface
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