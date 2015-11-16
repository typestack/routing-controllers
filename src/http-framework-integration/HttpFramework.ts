import {ActionType} from "../metadata/ActionMetadata";
import {ParamType} from "../metadata/ParamMetadata";
import {ResponseInterceptorInterface} from "../ResponseInterceptorInterface";

export interface HttpFramework {

    registerAction(path: string|RegExp, action: string, callback: (request: any, response: any) => any): void;
    handleParam(request: any, paramName: string, paramType: ParamType): void;
    handleError(request: any, response: any, error: any, asJson: boolean, errorHttpCode: number, interceptors: ResponseInterceptorInterface[]): void
    handleSuccess(request: any, response: any, result: any, asJson: boolean, successHttpCode: number, interceptors: ResponseInterceptorInterface[]): void;

}