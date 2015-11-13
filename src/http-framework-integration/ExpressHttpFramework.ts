import {HttpFramework} from "./HttpFramework";
import {ActionType} from "../metadata/ActionMetadata";
import {ParamType} from "../metadata/ParamMetadata";

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

    handleSuccess(response: any, result: any, asJson: boolean, successHttpCode: number): void {
        if (successHttpCode)
            response.status(successHttpCode);

        if (result !== null && result !== undefined) {
            if (asJson) {
                response.json(result);
            } else {
                response.send(String(result));
            }
        }

        response.end();
    }

    handleError(response: any, error: any, asJson: boolean, errorHttpCode: number = 500): void {
        response.status(errorHttpCode);
        if (error) {
            if (asJson) {
                response.json(error);
            } else {
                response.send(String(error));
            }
        }

        response.end();
    }

}