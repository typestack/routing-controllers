import {AuthorizationCheckerInterface} from "./interface/AuthorizationCheckerInterface";
import {ClassTransformOptions} from "class-transformer";
import {CurrentUserLoaderInterface} from "./interface/CurrentUserLoaderInterface";
import {ValidatorOptions} from "class-validator";
import {CorsOptions} from "cors";
import {Application} from "express";
import {ContainerInstance} from "typedi";

/**
 * Routing controller initialization options.
 */
export interface TypeStackOptions {

    /**
     * Port on which http server must be launched.
     */
    port?: number;

    /**
     * List of controllers to register in the framework or directories from where to import all your controllers.
     */
    controllers?: (string|Function)[];

    /**
     * List of middlewares to register in the framework or directories from where to import all your middlewares.
     */
    middlewares?: Function[];

    /**
     * List of interceptors to register in the framework or directories from where to import all your interceptors.
     */
    interceptors?: Function[];

    /**
     * Indicates if cors are enabled.
     * Disabled by default.
     *
     * @see https://github.com/expressjs/cors
     */
    cors?: boolean|CorsOptions;

    /**
     * Global route prefix, for example '/api'.
     */
    routePrefix?: string;

    /**
     * Class used as authorized user instance.
     */
    currentUser?: Function;

    /**
     * If provided, then given express application instance will be used instead of creating a new one.
     * This way you can pre-configure your express application.
     */
    expressApp?: Application;

    /**
     * Indicates if class-transformer should be used to perform serialization / deserialization.
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
     * You can also directly pass validator options to enable validator with a given options.
     */
    validation?: boolean|ValidatorOptions;

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

    /**
     * Special function used to check user authorization roles per request.
     * Must return true or promise with boolean true resolved for authorization to succeed.
     */
    authorizationChecker?: AuthorizationCheckerInterface;

    /**
     * Special function used to load currently authorized user.
     */
    currentUserLoader?: CurrentUserLoaderInterface;

    /**
     * Can be used to setup container on each user request.
     * For example, you can setup logger instance specifically for the currently authorized user.
     */
    setupContainer?: (container: ContainerInstance) => Promise<any>|any;
    
    /**
     * Default settings.
     */
    defaults?: {

        /**
         * If set, all null responses will return specified status code by default.
         */
        nullResultCode?: number;

        /**
         * If set, all undefined responses will return specified status code by default.
         */
        undefinedResultCode?: number;

        /**
         * Default param options.
         */
        paramOptions?: {

            /**
             * If true, all non-set parameters will be required by default.
             */
            required?: boolean;

        };

    };
}