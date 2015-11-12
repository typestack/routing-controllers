import {ActionType} from "../metadata/ActionMetadata";
import {ParamType} from "../metadata/ParamMetadata";

export interface HttpFramework {

    registerAction(path: string, action: string, callback: (request: any, response: any) => any): void;
    handleParam(request: any, paramName: string, paramType: ParamType): void;
    handleError(response: any, error: any, asJson: boolean, errorHttpCode: number): void
    handleSuccess(response: any, result: any, asJson: boolean, successHttpCode: number): void;

}