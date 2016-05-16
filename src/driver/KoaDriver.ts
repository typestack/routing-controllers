import {Driver} from "./Driver";
import {BadHttpActionError} from "./error/BadHttpActionError";
import {ParamTypes} from "../metadata/types/ParamTypes";
import {ActionMetadata} from "../metadata/ActionMetadata";
import {HttpError} from "../error/http/HttpError";
import {MiddlewareMetadata} from "../metadata/MiddlewareMetadata";
import {ActionCallbackOptions} from "../ActionCallbackOptions";
import {ErrorHandlerMetadata} from "../metadata/ErrorHandlerMetadata";
import {BaseDriver} from "./BaseDriver";
import {constructorToPlain} from "constructor-utils/index";

/**
 * Integration with koa framework.
 */
export class KoaDriver extends BaseDriver implements Driver {

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private koa: any, private router: any) {
        super();
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    registerErrorHandler(errorHandler: ErrorHandlerMetadata): void {
        this.koa.use(function (error: any, request: any, response: any, next: Function) {
            errorHandler.instance.handle(error, request, response, next);
        });
    }

    registerMiddleware(middleware: MiddlewareMetadata): void {
        this.koa.use(function (request: any, response: any, next: Function) {
            middleware.instance.use(request, response, next);
        });
    }
    
    registerAction(action: ActionMetadata, executeCallback: (options: ActionCallbackOptions) => any): void {
        const koaAction = action.type.toLowerCase();
        if (!this.router[koaAction])
            throw new BadHttpActionError(action.type);

        this.router[koaAction](action.fullRoute, function(ctx: any, next: Function) {
            return new Promise((resolve, reject) => {
                const options: ActionCallbackOptions = {
                    request: ctx.request,
                    response: ctx.response,
                    next: next,
                    resolver: resolve,
                    rejecter: reject
                };
                executeCallback(options);
            });
        });
    }

    getParamFromRequest(request: any, param: any): void {
        switch (param.type) {
            case ParamTypes.BODY:
                return request.body;
            case ParamTypes.PARAM:
                return request.params[param.name];
            case ParamTypes.QUERY:
                return request.query[param.name];
            case ParamTypes.BODY_PARAM:
                return request.body[param.name];
            case ParamTypes.COOKIE:
                return request.cookies[param.name];
        }
    }

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
            options.resolver();

        } else if (action.renderedTemplate) { // if template is set then render it // todo: not working in koa
            const renderOptions = result && result instanceof Object ? result : {};

            this.koa.render(action.renderedTemplate, renderOptions, (err: any, html: string) => {
                if (err && action.isJsonTyped) {
                    options.next(err);
                    options.rejecter(err);

                } else if (err && !action.isJsonTyped) {
                    options.next(err);
                    options.rejecter(err);

                } else if (html) {
                    response.body = html;
                }
                options.next();
                options.resolver();
            });

        } else if (result !== null && result !== undefined) { // send regular result
            response.body = result;
            options.next();
            options.resolver();

        } else {
            options.next();
            options.resolver();
        }
    }

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
            response.set(name, action.headers[name]);
        });

        // send error content
        if (action.isJsonTyped) {
            response.body = this.processJsonError(error);
        } else {
            response.body = this.processJsonError(error);
        }
        options.next(error);
        options.rejecter(error);
    }

}