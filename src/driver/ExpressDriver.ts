import {Driver} from "./Driver";
import {BadHttpActionError} from "./error/BadHttpActionError";
import {ParamTypes} from "../metadata/types/ParamTypes";
import {ActionMetadata} from "../metadata/ActionMetadata";
import {ServerResponse, IncomingMessage} from "http";
import {HttpError} from "../error/http/HttpError";
import {MiddlewareMetadata} from "../metadata/MiddlewareMetadata";
import {ActionCallbackOptions} from "../ActionCallbackOptions";
import {ErrorHandlerMetadata} from "../metadata/ErrorHandlerMetadata";
import {BaseDriver} from "./BaseDriver";
import {constructorToPlain} from "constructor-utils/index";
import {UseMetadata} from "../metadata/UseMetadata";

/**
 * Integration with Express.js framework.
 */
export class ExpressDriver extends BaseDriver implements Driver {

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private express: any) {
        super();
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    registerErrorHandler(middleware: MiddlewareMetadata): void {
        if (!middleware.expressErrorHandlerInstance.error)
            return;

        this.express.use(function (error: any, request: any, response: any, next: Function) {
            middleware.expressErrorHandlerInstance.error(error, request, response, next);
        });
    }

    registerMiddleware(middleware: MiddlewareMetadata): void {
        if (!middleware.expressInstance.use)
            return;
        
        this.express.use(function (request: any, response: any, next: Function) {
            middleware.expressInstance.use(request, response, next);
        });
    }
    
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
        
        const uses = action.controllerMetadata.uses.concat(action.uses);
        const fullRoute = `${this.routePrefix}${action.fullRoute}`;
        const preMiddlewareFunctions = this.registerUses(uses.filter(use => !use.afterAction), middlewares);
        const postMiddlewareFunctions = this.registerUses(uses.filter(use => use.afterAction), middlewares);
        const expressParams: any[] = [fullRoute, ...preMiddlewareFunctions, routeHandler, ...postMiddlewareFunctions];

        // finally register action
        this.express[expressAction](...expressParams);
    }

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
                return request.headers[param.name];
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
                response.send();
            } else {
                if (action.isJsonTyped) {
                    response.json(result);
                } else {
                    response.send(result);
                }
                options.next();
            }

        } else {
            options.next();
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
    
}