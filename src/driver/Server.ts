import {ActionMetadata} from "../metadata/ActionMetadata";
import {ServerResponse, IncomingMessage} from "http";
import {ParamMetadata} from "../metadata/ParamMetadata";
import {MiddlewareMetadata} from "../metadata/MiddlewareMetadata";
import {ActionCallbackOptions} from "../ActionCallbackOptions";
import {ErrorHandlerMetadata} from "../metadata/ErrorHandlerMetadata";

/**
 * Abstract layer to organize controllers integration with different http server implementations.
 */
export interface Driver {

    registerErrorHandler(errorHandler: ErrorHandlerMetadata): void;
    
    registerMiddleware(middleware: MiddlewareMetadata): void;

    /**
     * Registers action in the server framework.
     */
    registerAction(action: ActionMetadata, executeCallback: (options: ActionCallbackOptions) => any): void;

    /**
     * Gets param from the request.
     */
    getParamFromRequest(request: IncomingMessage, param: ParamMetadata): void;

    /**
     * Defines an algorithm of how to handle error during executing controller action.
     */
    handleError(error: any, action: ActionMetadata, options: ActionCallbackOptions): void;

    /**
     * Defines an algorithm of how to handle success result of executing controller action.
     */
    handleSuccess(result: any, action: ActionMetadata, options: ActionCallbackOptions): void;

}