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

    registerErrorHandler(errorHandler: ErrorHandlerMetadata): void {
        this.express.use(function (error: any, request: any, response: any, next: Function) {
            errorHandler.instance.handle(error, request, response, next);
        });
    }

    registerPreExecutionMiddleware(middleware: MiddlewareMetadata): void {
        if (!middleware.instance.use)
            return;
        
        this.express.use(function (request: any, response: any, next: Function) {
            middleware.instance.use(request, response, next);
        });
    }

    registerPostExecutionMiddleware(middleware: MiddlewareMetadata): void {
        if (!middleware.instance.afterUse)
            return;
        
        this.express.use(function (request: any, response: any, next: Function) {
            middleware.instance.afterUse(request, response, next);
        });
    }
    
    registerAction(action: ActionMetadata, executeCallback: (options: ActionCallbackOptions) => any): void {
        const expressAction = action.type.toLowerCase();
        if (!this.express[expressAction])
            throw new BadHttpActionError(action.type);

        this.express[expressAction](action.fullRoute, function(request: IncomingMessage, response: ServerResponse, next: Function) {
            const options: ActionCallbackOptions = {
                request: request,
                response: response,
                next: next
            };
            executeCallback(options);
        });
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

        } else if (result !== null && result !== undefined) { // send regular result
            if (action.isJsonTyped) {
                response.json(result);
            } else {
                response.send(result);
            }
            options.next();

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

}