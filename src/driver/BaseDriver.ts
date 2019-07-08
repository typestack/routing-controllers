import {ValidatorOptions} from 'class-validator';
import {ClassTransformOptions, classToPlain} from 'class-transformer';

import {HttpError} from '../http-error/HttpError';
import {CurrentUserChecker} from '../CurrentUserChecker';
import {AuthorizationChecker} from '../AuthorizationChecker';
import {ActionMetadata} from '../metadata/ActionMetadata';
import {ParamMetadata} from '../metadata/ParamMetadata';
import {MiddlewareMetadata} from '../metadata/MiddlewareMetadata';
import {Action} from '../Action';

/**
 * Base driver functionality for all other drivers.
 * Abstract layer to organize controllers integration with different http server implementations.
 */
export abstract class BaseDriver {

    // -------------------------------------------------------------------------
    // Public Properties
    // -------------------------------------------------------------------------

    /**
     * Reference to the underlying framework app object.
     */
    public app: any;

    /**
     * Special function used to check user authorization roles per request.
     * Must return true or promise with boolean true resolved for authorization to succeed.
     */
    public authorizationChecker?: AuthorizationChecker;

    /**
     * Global class transformer options passed to class-transformer during classToPlain operation.
     * This operation is being executed when server returns response to user.
     */
    public classToPlainTransformOptions: ClassTransformOptions;

    /**
     * Indicates if cors are enabled.
     * This requires installation of additional module (cors for express and kcors for koa).
     */
    public cors?: boolean|Object;

    /**
     * Special function used to get currently authorized user.
     */
    public currentUserChecker?: CurrentUserChecker;

    /**
     * Indicates if routing-controllers should operate in development mode.
     */
    public developmentMode: boolean;

    /**
     * Indicates if class-validator should be used or not.
     */
    public enableValidation: boolean;

    /**
     * Map of error overrides.
     */
    public errorOverridingMap: { [key: string]: any };

    /**
     * Indicates if default routing-controllers error handler should be used or not.
     */
    public isDefaultErrorHandlingEnabled: boolean;

    /**
     * Global class transformer options passed to class-transformer during plainToClass operation.
     * This operation is being executed when parsing user parameters.
     */
    public plainToClassTransformOptions: ClassTransformOptions;

    /**
     * Global application prefix.
     */
    public routePrefix: string = '';

    /**
     * Indicates if class-transformer should be used or not.
     */
    public useClassTransformer: boolean;

    /**
     * Global class-validator options passed during validate operation.
     */
    public validationOptions: ValidatorOptions;

    /**
     * Gets param from the request.
     */
    public abstract getParamFromRequest(actionOptions: Action, param: ParamMetadata): any;

    /**
     * Defines an algorithm of how to handle error during executing controller action.
     */
    public abstract handleError(error: any, action: ActionMetadata, options: Action): any;

    /**
     * Defines an algorithm of how to handle success result of executing controller action.
     */
    public abstract handleSuccess(result: any, action: ActionMetadata, options: Action): void;

    /**
     * Initializes the things driver needs before routes and middleware registration.
     */
    public abstract initialize(): void;

    /**
     * Registers action in the driver.
     */
    public abstract registerAction(action: ActionMetadata, executeCallback: (options: Action) => any): void;

    /**
     * Registers given middleware.
     */
    public abstract registerMiddleware(middleware: MiddlewareMetadata): void;

    /**
     * Registers all routes in the framework.
     */
    public abstract registerRoutes(): void;

    protected merge(obj1: any, obj2: any): any {
        const result: any = {};
        for (const i in obj1) {
            if ((i in obj2) && (typeof obj1[i] === 'object') && (i !== null)) {
                result[i] = this.merge(obj1[i], obj2[i]);
            } else {
                result[i] = obj1[i];
            }
        }
        for (const i in obj2) {
            result[i] = obj2[i];
        }
        return result;
    }

    protected processJsonError(error: any) {
        if (!this.isDefaultErrorHandlingEnabled) {
            return error;
        }

        if (typeof error.toJSON === 'function') {
            return error.toJSON();
        }

        let processedError: any = {};
        if (error instanceof Error) {
            const name = error.name && error.name !== 'Error' ? error.name : error.constructor.name;
            processedError.name = name;

            if (error.message) {
                processedError.message = error.message;
            }
            if (error.stack && this.developmentMode) {
                processedError.stack = error.stack;
            }

            Object.keys(error)
                .filter(key => key !== 'stack' && key !== 'name' && key !== 'message' && (!(error instanceof HttpError) || key !== 'httpCode'))
                .forEach(key => processedError[key] = (error as any)[key]);

            if (this.errorOverridingMap) {
                Object.keys(this.errorOverridingMap)
                    .filter(key => name === key)
                    .forEach(key => processedError = this.merge(processedError, this.errorOverridingMap[key]));
            }

            return Object.keys(processedError).length > 0 ? processedError : undefined;
        }

        return error;
    }

    protected processTextError(error: any) {
        if (!this.isDefaultErrorHandlingEnabled) {
            return error;
        }

        if (error instanceof Error) {
            if (this.developmentMode && error.stack) {
                return error.stack;

            } else if (error.message) {
                return error.message;
            }
        }
        return error;
    }

    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------

    protected transformResult(result: any, action: ActionMetadata, options: Action): any {
        // check if we need to transform result
        const shouldTransform = (this.useClassTransformer && result != null) // transform only if enabled and value exist
            && result instanceof Object // don't transform primitive types (string/number/boolean)
            && !(
                result instanceof Uint8Array // don't transform binary data
                ||
                result.pipe instanceof Function // don't transform streams
            );

        // transform result if needed
        if (shouldTransform) {
            const options = action.responseClassTransformOptions || this.classToPlainTransformOptions;
            result = classToPlain(result, options);
        }

        return result;
    }

}
