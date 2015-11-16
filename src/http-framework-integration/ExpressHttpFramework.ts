import {HttpFramework} from "./HttpFramework";
import {ActionType} from "../metadata/ActionMetadata";
import {ParamType} from "../metadata/ParamMetadata";
import {ResponseInterceptorInterface} from "../ResponseInterceptorInterface";

export class ExpressHttpFramework implements HttpFramework {

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private express: any) {
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    registerAction(path: string|RegExp, actionName: string, callback: (request: any, response: any) => any): void {
        if (!this.express[actionName.toLowerCase()])
            throw new Error('Given method cannot be registered in the Express framework');

        this.express[actionName.toLowerCase()](path, (request: any, response: any) => callback(request, response));
    }

    handleParam(request: any, paramName: string, paramType: ParamType): void {
        switch (paramType) {
            case ParamType.BODY:
                return request.body;
            case ParamType.PARAM:
                return request.params[paramName];
            case ParamType.QUERY:
                return request.query[paramName];
            case ParamType.BODY_PARAM:
                return request.body[paramName];
            case ParamType.COOKIE:
                return request.cookies[paramName];
        }
    }

    handleSuccess(request: any, response: any, result: any, asJson: boolean, successHttpCode: number, interceptors: ResponseInterceptorInterface[]): void {
        if (successHttpCode)
            response.status(successHttpCode);

        if (result !== null && result !== undefined) {
            if (asJson) {
                result = this.callJsonInterceptors(result, request, response, interceptors);
                response.json(result);
            } else {
                result = this.callSendInterceptors(String(result), request, response, interceptors);
                response.send(result);
            }
        }

        response.end();
    }

    handleError(request: any, response: any, error: any, asJson: boolean, errorHttpCode: number, interceptors: ResponseInterceptorInterface[]): void {
        response.status(errorHttpCode);
        if (error) {
            if (asJson) {
                error = this.callJsonInterceptors(error, request, response, interceptors);
                response.json(error);
            } else {
                error = this.callSendInterceptors(String(error), request, response, interceptors);
                response.send(error);
            }
        }

        response.end();
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    private callSendInterceptors(data: any, request: any, response: any, interceptors: ResponseInterceptorInterface[]) {
        if (interceptors && interceptors.length) {
            return interceptors
                .filter(inter => !!inter.onSend)
                .reduce((value, inter) => inter.onSend(value, request, response), data);
        }

        return data;
    }

    private callJsonInterceptors(data: any, request: any, response: any, interceptors: ResponseInterceptorInterface[]) {
        if (interceptors && interceptors.length) {
            return interceptors
                .filter(inter => !!inter.onJson)
                .reduce((value, inter) => inter.onJson(value, request, response), data);
        }

        return data;
    }

}