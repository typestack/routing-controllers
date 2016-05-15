import {Driver} from "./driver/Server";
import {Utils} from "./Utils";
import {ParamHandler} from "./ParamHandler";
import {jsonErrorHandler, defaultErrorHandler} from "./ErrorHandlers";
import {constructorToPlain} from "constructor-utils";
import {MetadataBuilder} from "./metadata-builder/MetadataBuilder";
import {ActionMetadata} from "./metadata/ActionMetadata";
import {ActionCallbackOptions} from "./ActionCallbackOptions";

export type JsonErrorHandlerFunction = (error: any, isDebug: boolean, errorOverridingMap: any) => any;
export type DefaultErrorHandlerFunction = (error: any) => any;

/**
 * Registers controllers and actions in the given server framework.
 */
export class RoutingControllerExecutor {

    // -------------------------------------------------------------------------
    // Public Properties
    // -------------------------------------------------------------------------

    errorOverridingMap: Object;

    // -------------------------------------------------------------------------
    // Private properties
    // -------------------------------------------------------------------------

    /**
     * Enables console.logging of errors if error occur in handled result.
     */
    isLogErrorsEnabled: boolean;

    /**
     * Enables stack trace output if error occur in handled result.
     */
    isStackTraceEnabled: boolean;

    /**
     * Sets custom json error handler.
     */
    jsonErrorHandler: JsonErrorHandlerFunction = jsonErrorHandler;

    /**
     * Sets custom error handler.
     *
     * @param handler
     */
    defaultErrorHandler: DefaultErrorHandlerFunction = defaultErrorHandler;

    private paramHandler: ParamHandler;
    private metadataBuilder: MetadataBuilder;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private driver: Driver) {
        this.paramHandler = new ParamHandler(driver);
        this.metadataBuilder = new MetadataBuilder();
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Registers actions in the driver.
     */
    registerActions(classes?: Function[]): this {
        const controllers = this.metadataBuilder.buildControllerMetadata(classes);
        controllers.forEach(controller => {
            controller.actions.forEach(action => {
                this.driver.registerAction(action, (options: ActionCallbackOptions) => {
                    this.handleAction(action, options);
                });
            });
        });
        return this;
    }

    /**
     * Registers error handler middlewares in the driver.
     */
    registerErrorHandlers(classes?: Function[]): this {
        this.metadataBuilder
            .buildErrorHandlerMetadata(classes)
            .filter(errorHandler => !errorHandler.hasRoutes)
            .sort((errorHandler1, errorHandler2) => errorHandler1.priority - errorHandler2.priority)
            .forEach(errorHandler => this.driver.registerErrorHandler(errorHandler));
        
        return this;
    }

    /**
     * Registers pre-execution middlewares in the driver.
     */
    registerPreExecutionMiddlewares(classes?: Function[]): this {
        this.metadataBuilder
            .buildMiddlewareMetadata(classes)
            .filter(middleware => !middleware.hasRoutes && !middleware.afterAction)
            .sort((middleware1, middleware2) => middleware1.priority - middleware2.priority)
            .forEach(middleware => this.driver.registerMiddleware(middleware));
        
        return this;
    }

    /**
     * Registers post-execution middlewares in the driver.
     */
    registerPostExecutionMiddlewares(classes?: Function[]): this {
        this.metadataBuilder
            .buildMiddlewareMetadata(classes)
            .filter(middleware => !middleware.hasRoutes && middleware.afterAction)
            .sort((middleware1, middleware2) => middleware1.priority - middleware2.priority)
            .forEach(middleware => this.driver.registerMiddleware(middleware));
        
        return this;
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    private handleAction(action: ActionMetadata, options: ActionCallbackOptions) {

        // compute all parameters
        const paramsPromises = action.params
            .sort((param1, param2) => param1.index - param2.index)
            .map(param => this.paramHandler.handleParam(options.request, options.response, param));

        // after all parameters are computed
        Promise.all(paramsPromises).then(params => {

            // execute action and handle result
            const result = action.executeAction(params);
            if (result)
                this.handleResult(result, action, options);

        }).catch(error => {

            // if error then handle the error
            if (this.processErrorWithErrorHandler(error, action.isJsonTyped))
                this.handleError(error, action, options);

            throw error;
        });
    }

    private handleResult(result: any, action: ActionMetadata, options: ActionCallbackOptions) {
        // result = action.isJsonTyped ? result : String(result); // todo: don't think this is correct. result can be a promise
        if (Utils.isPromise(result)) {
            result
                .then((data: any) => this.handleResult(data, action, options))
                .catch((error: any) => {
                    this.handleError(error, action, options);
                    throw error;
                });
        } else {
            if (result && result instanceof Object) {
                result = constructorToPlain(result); // todo: specify option to disable it?
            }
            this.driver.handleSuccess(result, action, options);
        }
    }

    private handleError(error: any, action: ActionMetadata, options: ActionCallbackOptions) {
        const responseError = this.processErrorWithErrorHandler(error, action.isJsonTyped);
        // if (this.isLogErrorsEnabled) // todo: middleware?
        //     console.error(error.stack ? error.stack : error);

        // options.errorHttpCode = options.errorHttpCode || 500; // todo: driver must do it?
        /*if (error instanceof HttpError && error.httpCode) { // move this to driver
            options.errorHttpCode = error.httpCode;

        } else if (typeof responseError === "object" && responseError.httpCode) { // todo: why do we need this?!
            // this can be there if custom validation handler decided to return httpCode or error override map did
            options.errorHttpCode = responseError.httpCode;
            delete responseError.httpCode;
        }*/

        // options.content = responseError;
        this.driver.handleError(error, action, options);
    }

    /**
     * Handles response error.
     *
     * @param error Error to be handled
     * @param isJson Indicates if response is json-typed or not
     * @returns {any}
     */
    private processErrorWithErrorHandler(error: any, isJson: boolean): any {
        if (isJson && this.jsonErrorHandler) {
            return this.jsonErrorHandler(error, this.isStackTraceEnabled, this.errorOverridingMap);

        } else if (!isJson && this.defaultErrorHandler) {
            return this.defaultErrorHandler(error);
        }
    }

}