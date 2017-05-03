import {ValidatorOptions} from "class-validator";
import {ActionMetadata} from "../metadata/ActionMetadata";
import {ParamMetadata} from "../metadata/ParamMetadata";
import {MiddlewareMetadata} from "../metadata/MiddlewareMetadata";
import {ActionProperties} from "../ActionProperties";
import {ClassTransformOptions} from "class-transformer";
import {AuthorizationChecker} from "../AuthorizationChecker";
import {CurrentUserChecker} from "../CurrentUserChecker";

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
    validationOptions: ValidatorOptions;

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

    /**
     * Special function used to check user authorization roles per request.
     * Must return true or promise with boolean true resolved for authorization to succeed.
     */
    authorizationChecker?: AuthorizationChecker;

    /**
     * Special function used to get currently authorized user.
     */
    currentUserChecker?: CurrentUserChecker;

    /**
     * Initializes the things driver needs before routes and middleware registration.
     */
    initialize(): void;

    /**
     * Registers given middleware.
     */
    registerMiddleware(middleware: MiddlewareMetadata): void;

    /**
     * Registers action in the driver.
     */
    registerAction(action: ActionMetadata, executeCallback: (options: ActionProperties) => any): void;

    /**
     * Registers all routes in the framework.
     */
    registerRoutes(): void;

    /**
     * Gets param from the request.
     */
    getParamFromRequest(actionOptions: ActionProperties, param: ParamMetadata): any;

    /**
     * Defines an algorithm of how to handle error during executing controller action.
     */
    handleError(error: any, action: ActionMetadata, options: ActionProperties): any;

    /**
     * Defines an algorithm of how to handle success result of executing controller action.
     */
    handleSuccess(result: any, action: ActionMetadata, options: ActionProperties): void;

}