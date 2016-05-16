import {ActionMetadata} from "../metadata/ActionMetadata";
import {IncomingMessage} from "http";
import {ParamMetadata} from "../metadata/ParamMetadata";
import {MiddlewareMetadata} from "../metadata/MiddlewareMetadata";
import {ActionCallbackOptions} from "../ActionCallbackOptions";
import {ErrorHandlerMetadata} from "../metadata/ErrorHandlerMetadata";

/**
 * Abstract layer to organize controllers integration with different http server implementations.
 */
export interface Driver {

    /**
     * Indicates if constructor-utils should be used to perform serialization / deserialization.
     */
    useConstructorUtils: boolean;

    /**
     * Indicates if default routing-controller's error handling is enabled or not.
     */
    isDefaultErrorHandlingEnabled: boolean;

    /**
     * Indicates if debug mode is enabled or not. In debug mode additional information may be exposed.
     */
    developmentMode: boolean;

    /**
     * Map of error overrides.
     */
    errorOverridingMap: { [key: string]: any };

    /**
     * Registers given error handler in the driver.
     */
    registerErrorHandler(errorHandler: ErrorHandlerMetadata): void;

    /**
     * Registers given middleware in the driver.
     */
    registerMiddleware(middleware: MiddlewareMetadata): void;

    /**
     * Registers action in the driver.
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