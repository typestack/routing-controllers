import {ClassTransformOptions} from "class-transformer";
import {ValidatorOptions} from "class-validator";

/**
 * Routing controller initialization options.
 */
export interface RoutingControllersOptions {

    /**
     * List of directories from where to "require" all your controllers.
     */
    controllers?: string[];

    /**
     * List of directories from where to "require" all your middlewares.
     */
    middlewares?: string[];

    /**
     * List of directories from where to "require" all your interceptors.
     */
    interceptors?: string[];

    /**
     * List of directories from where to "require" all your controllers.
     *
     * @deprecated Use controllers instead.
     */
    controllerDirs?: string[];

    /**
     * List of directories from where to "require" all your middlewares.
     *
     * @deprecated Use middlewares instead.
     */
    middlewareDirs?: string[];

    /**
     * List of directories from where to "require" all your interceptors.
     *
     * @deprecated Use interceptors instead.
     */
    interceptorDirs?: string[];

    /**
     * Indicates if constructor-utils should be used to perform serialization / deserialization.
     */
    useClassTransformer?: boolean;

    /**
     * Indicates if class-validator should be used to auto validate objects injected into params.
     */
    enableValidation?: boolean;

    /**
     * Global class-validator options passed during validate operation.
     */
    validationOptions?: ValidatorOptions;

    /**
     * Global class transformer options passed to class-transformer during classToPlain operation.
     * This operation is being executed when server returns response to user.
     */
    classToPlainTransformOptions?: ClassTransformOptions;

    /**
     * Global class transformer options passed to class-transformer during plainToClass operation.
     * This operation is being executed when parsing user parameters.
     */
    plainToClassTransformOptions?: ClassTransformOptions;

    /**
     * Indicates if development mode is enabled. By default its enabled if your NODE_ENV is not equal to "production".
     */
    developmentMode?: boolean;

    /**
     * Indicates if default routing-controller's error handler is enabled or not. By default its enabled.
     */
    defaultErrorHandler?: boolean;

    /**
     * Map of error overrides.
     */
    errorOverridingMap?: Object;
    
    /**
     * Route prefix. eg '/api'
     */
    routePrefix?: string;
    
}