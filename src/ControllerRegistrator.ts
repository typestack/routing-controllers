import {Driver} from "./driver/Server";
import {Utils} from "./Utils";
import {ParamHandler} from "./ParamHandler";
import {jsonErrorHandler, defaultErrorHandler} from "./ErrorHandlers";
import {constructorToPlain} from "constructor-utils";
import {MetadataBuilder} from "./metadata-builder/MetadataBuilder";
import {ControllerMetadata} from "./metadata/ControllerMetadata";
import {ActionMetadata} from "./metadata/ActionMetadata";
import {IncomingMessage, ServerResponse} from "http";

export type JsonErrorHandlerFunction = (error: any, isDebug: boolean, errorOverridingMap: any) => any;
export type DefaultErrorHandlerFunction = (error: any) => any;

/**
 * Registers controllers and actions in the given server framework.
 */
export class ControllerRegistrator {

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
     * Registers all loaded to the metadata storage controllers and their actions.
     */
    registerAllActions(): this {
        const controllers = this.metadataBuilder.buildControllerMetadata();
        this.registerControllerActions(controllers);
        return this;
    }

    /**
     * Registers actions from the given controllers.
     */
    registerActions(classes: Function[]): this {
        const controllers = this.metadataBuilder.buildControllerMetadata(classes);
        this.registerControllerActions(controllers);
        return this;
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    private registerControllerActions(controllers: ControllerMetadata[]) {
        controllers.forEach(controller => {
            controller.actions.forEach(action => {
                this.driver.registerAction(action, (request: IncomingMessage, response: ServerResponse) => {
                    this.handleAction(request, response, action);
                });
            });
        });
    }

    private handleAction(request: IncomingMessage, response: ServerResponse, action: ActionMetadata) {

        // compute all parameters
        const paramsPromises = action.params
            .sort((param1, param2) => param1.index - param2.index)
            .map(param => this.paramHandler.handleParam(request, response, param));

        // after all parameters are computed
        Promise.all(paramsPromises).then(params => {

            // execute action and handle result
            const result = action.executeAction(params);
            if (result)
                this.handleResult(request, response, action, result);

        }).catch(error => {

            // if error then handle the error
            if (this.processErrorWithErrorHandler(error, action.isJsonTyped))
                this.handleError(request, response, action, error);

            throw error;
        });
    }

    private handleResult(request: IncomingMessage, response: ServerResponse, action: ActionMetadata, result: any) {
        // result = action.isJsonTyped ? result : String(result); // todo: don't think this is correct. result can be a promise
        if (Utils.isPromise(result)) {
            result
                .then((data: any) => this.handleResult(request, response, action, data))
                .catch((error: any) => {
                    this.handleError(request, response, action, error);
                    throw error;
                });
        } else {
            if (result && result instanceof Object) {
                result = constructorToPlain(result); // todo: specify option to disable it?
            }
            this.driver.handleSuccess(request, response, action, result);
        }
    }

    private handleError(request: IncomingMessage, response: ServerResponse, action: ActionMetadata, error: any) {
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
        this.driver.handleError(request, response, action, error);
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