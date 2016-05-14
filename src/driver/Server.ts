import {ActionMetadata} from "../metadata/ActionMetadata";
import {ServerResponse, IncomingMessage} from "http";
import {ParamMetadata} from "../metadata/ParamMetadata";
import {MiddlewareMetadata} from "../metadata/MiddlewareMetadata";

/**
 * Abstract layer to organize controllers integration with different http server implementations.
 */
export interface Driver {

    registerMiddleware(middleware: MiddlewareMetadata): void;

    /**
     * Registers action in the server framework.
     */
    registerAction(action: ActionMetadata, executeCallback: (request: IncomingMessage, response: ServerResponse) => any): void;

    /**
     * Gets param from the request.
     */
    getParamFromRequest(request: IncomingMessage, param: ParamMetadata): void;

    /**
     * Defines an algorithm of how to handle error during executing controller action.
     */
    handleError(request: IncomingMessage, response: ServerResponse, action: ActionMetadata, error: any): void;

    /**
     * Defines an algorithm of how to handle success result of executing controller action.
     */
    handleSuccess(request: IncomingMessage, response: ServerResponse, action: ActionMetadata, result: any): void;

}