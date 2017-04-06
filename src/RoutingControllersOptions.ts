import {ClassTransformOptions} from "class-transformer";
import {ValidatorOptions} from "class-validator";

/**
 * Routing controller initialization options.
 */
export interface RoutingControllersOptions {

    /**
     * Global route prefix, for example '/api'.
     */
    routePrefix?: string;

    /**
     * List of controllers to register in the framework or directories from where to import all your controllers.
     */
    controllers?: Function[]|string[];

    /**
     * List of middlewares to register in the framework or directories from where to import all your middlewares.
     */
    middlewares?: Function[]|string[];

    /**
     * Indicates if constructor-utils should be used to perform serialization / deserialization.
     */
    classTransformer?: boolean;

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
     * Indicates if class-validator should be used to auto validate objects injected into params.
     */
    validator?: boolean;

    /**
     * Global class-validator options passed during validate operation.
     */
    validatorOptions?: ValidatorOptions;

    /**
     * Indicates if development mode is enabled.
     * By default its enabled if your NODE_ENV is not equal to "production".
     */
    development?: boolean;

    /**
     * Indicates if default routing-controller's error handler is enabled or not.
     * Enabled by default.
     */
    defaultErrorHandler?: boolean;

    /**
     * Map of error overrides.
     */
    errorOverridingMap?: { [key: string]: any };

    // deprecated API:

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
     * Indicates if constructor-utils should be used to perform serialization / deserialization.
     *
     * @deprecated use classTransformer option instead
     * @deprecated name is not consistent with "enableValidation" option but does the same thing but for another module
     */
    useClassTransformer?: boolean;

    /**
     * Indicates if class-validator should be used to auto validate objects injected into params.
     *
     * @deprecated use validator option instead
     * @deprecated name is not consistent with "useClassTransformer" option but does the same thing but for another module
     */
    enableValidation?: boolean;

    /**
     * Global class-validator options passed during validate operation.
     *
     * @deprecated use validatorOptions instead - name does not represent what is inside and confusing because there is ValidationOptions object too.
     */
    validationOptions?: ValidatorOptions;

    /**
     * Indicates if development mode is enabled.
     * By default its enabled if your NODE_ENV is not equal to "production".
     *
     * @deprecated use development option instead
     */
    developmentMode?: boolean;
    
}