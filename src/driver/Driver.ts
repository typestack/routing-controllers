import {ValidationOptions} from "class-validator";
import {ActionMetadata} from "../metadata/ActionMetadata";
import {ParamMetadata} from "../metadata/ParamMetadata";
import {MiddlewareMetadata} from "../metadata/MiddlewareMetadata";
import {ActionCallbackOptions} from "../ActionCallbackOptions";
import {ClassTransformOptions} from "class-transformer";
import {InterceptorMetadata} from "../metadata/InterceptorMetadata";

/**
 * Abstract layer to organize controllers integration with different http server implementations.
 */
export interface Driver {

    /**
     * Indicates if constructor-utils should be used to perform serialization / deserialization.
     */
    useClassTransformer: boolean;
    
    /**
     * Indicates if class-validator should be used to auto validate objects injected into params.
     */
    enableValidation: boolean;

    /**
     * Global class-validator options passed during validate operation.
     */
    validationOptions: ValidationOptions;

    /**
     * Global class transformer options passed to class-transformer during classToPlain operation.
     * This operation is being executed when server returns response to user.
     */
    classToPlainTransformOptions: ClassTransformOptions;

    /**
     * Global class transformer options passed to class-transformer during plainToClass operation.
     * This operation is being executed when parsing user parameters.
     */
    plainToClassTransformOptions: ClassTransformOptions;

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
     * Route prefix. eg '/api'
     */
    routePrefix: string;

    bootstrap(): void;

    /**
     * Registers given error handler in the driver.
     */
    registerErrorHandler(middleware: MiddlewareMetadata): void;

    /**
     * Registers middleware that run before controller actions.
     */
    registerMiddleware(middleware: MiddlewareMetadata): void;

    /**
     * Registers action in the driver.
     */
    registerAction(action: ActionMetadata,
                   middlewares: MiddlewareMetadata[],
                   interceptors: InterceptorMetadata[],
                   executeCallback: (options: ActionCallbackOptions) => any): void;

    /**
     * Registers all routes in the framework.
     */
    registerRoutes(): void;

    /**
     * Gets param from the request.
     */
    getParamFromRequest(actionOptions: ActionCallbackOptions, param: ParamMetadata): void;

    /**
     * Defines an algorithm of how to handle error during executing controller action.
     */
    handleError(error: any, action: ActionMetadata, options: ActionCallbackOptions): void;

    /**
     * Defines an algorithm of how to handle success result of executing controller action.
     */
    handleSuccess(result: any, action: ActionMetadata, options: ActionCallbackOptions): void;

}