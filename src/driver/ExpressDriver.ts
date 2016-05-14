import {Driver} from "./Server";
import {BadHttpActionError} from "./error/BadHttpActionError";
import {ParamTypes} from "../metadata/types/ParamTypes";
import {ActionMetadata} from "../metadata/ActionMetadata";
import {ServerResponse, IncomingMessage} from "http";
import {HttpError} from "../error/http/HttpError";
import {MiddlewareMetadata} from "../metadata/MiddlewareMetadata";

/**
 * Integration with Express.js framework.
 */
export class ExpressDriver implements Driver {

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private express: any) {
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------


    registerMiddleware(middleware: MiddlewareMetadata): void {
        this.express.use(function (request: any, response: any, next: Function) {
            middleware.instance.use(request, response, next);
        });
    }
    
    registerAction(action: ActionMetadata, executeCallback: (request: IncomingMessage, response: ServerResponse) => any): void {
        const expressAction = action.type.toLowerCase();
        if (!this.express[expressAction])
            throw new BadHttpActionError(action.type);

        this.express[expressAction](action.fullRoute, executeCallback);
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

    handleSuccess(request: any, response: any, action: ActionMetadata, result: any): void {
        
        const isResultUndefined = result === undefined;
        const isResultNull = result === null;
        const isResultEmpty = isResultUndefined || isResultNull || result === false || result === "";
        
        if (action.undefinedResultCode && isResultUndefined) {
            response.status(action.undefinedResultCode);

        } else if (action.nullResultCode && isResultNull) {
            response.status(action.nullResultCode);

        } else if (action.emptyResultCode && isResultEmpty) {
            response.status(action.emptyResultCode);
            
        } else if (action.successHttpCode) {
            response.status(action.successHttpCode);
        }

        this.handleResult(request, response, action, result);
    }

    handleError(request: any, response: any, action: ActionMetadata, error: any): void {

        if (error instanceof HttpError && error.httpCode)
            response.status(error.httpCode);

        this.handleResult(request, response, action, error);
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    private handleResult(request: any, response: any, action: ActionMetadata, result: any) {

        // apply headers
        Object.keys(action.headers).forEach(name => {
            response.header(name, action.headers[name]);
        });
        
        // send result
        if (result !== null && result !== undefined) {
            if (action.renderedTemplate) {
                const renderOptions = result && result instanceof Object ? result : {};
                
                this.express.render(action.renderedTemplate, renderOptions, (err: any, html: string) => {
                    if (err && action.isJsonTyped) {
                        response.json(err);

                    } else if (err && !action.isJsonTyped) {
                        response.send(err);

                    } else if (html) {
                        response.send(html);
                    }
                });
                
            } else if (action.redirect) {
                response.redirect(action.redirect);

            } else if (action.isJsonTyped) {
                response.json(result);

            } else {
                response.send(result);
            }
            
        } else {
            if (action.isJsonTyped) {
                response.json();
            } else {
                response.send();
            }
        }

        response.end();
    }

}