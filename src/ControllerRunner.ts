import {Server} from "./server/Server";
import {ActionOptions, ActionMetadata} from "./metadata/ActionMetadata";
import {ControllerMetadata, ControllerType} from "./metadata/ControllerMetadata";
import {MetadataStorage, defaultMetadataStorage} from "./metadata/MetadataStorage";
import {Utils} from "./Utils";
import {ParamMetadata} from "./metadata/ParamMetadata";
import {ResponsePropertyMetadata, ResponsePropertyType} from "./metadata/ResponsePropertyMetadata";
import {ParamHandler} from "./ParamHandler";
import {HttpError} from "./error/http/HttpError";
import {jsonErrorHandler, defaultErrorHandler} from "./ErrorHandlers";
import {ResponseInterceptorInterface} from "./interceptor/ResponseInterceptorInterface";
import {ResponseInterceptorMetadata} from "./metadata/ResponseInterceptorMetadata";
import {ResultHandleOptions} from "./ResultHandleOptions";

export interface Container { get(someClass: any): any };
export type JsonErrorHandlerFunction = (error: any, isDebug: boolean, errorOverridingMap: any) => any;
export type DefaultErrorHandlerFunction = (error: any) => any;

/**
 * Registers controllers and actions in the given server framework.
 */
export class ControllerRunner {

    // -------------------------------------------------------------------------
    // Public Properties
    // -------------------------------------------------------------------------

    errorOverridingMap: Object;

    // -------------------------------------------------------------------------
    // Private properties
    // -------------------------------------------------------------------------

    private _container: Container;
    private _metadataStorage: MetadataStorage = defaultMetadataStorage;
    private _paramHandler: ParamHandler;
    private _isLogErrorsEnabled: boolean;
    private _isStackTraceEnabled: boolean;
    private _jsonErrorHandler: JsonErrorHandlerFunction = jsonErrorHandler;
    private _defaultErrorHandler: DefaultErrorHandlerFunction = defaultErrorHandler;
    private requireAll: Function = require("require-all");

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private framework: Server) {
        this._paramHandler = new ParamHandler(framework);
    }

    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------

    /**
     * Sets a container that can be used in your controllers. This allows you to inject services in your
     * controllers.
     */
    set container(container: Container) {
        this._container = container;
    }

    /**
     * Enables console.logging of errors if error occur in handled result.
     *
     * @param isEnabled
     */
    set isLogErrorsEnabled(isEnabled: boolean) {
        this._isLogErrorsEnabled = isEnabled;
    }

    /**
     * Enables stack trace output if error occur in handled result.
     *
     * @param isEnabled
     */
    set isStackTraceEnabled(isEnabled: boolean) {
        this._isStackTraceEnabled = isEnabled;
    }

    /**
     * Sets custom json error handler.
     *
     * @param handler
     */
    set jsonErrorHandler(handler: JsonErrorHandlerFunction) {
        this._jsonErrorHandler = handler;
    }

    /**
     * Sets custom error handler.
     *
     * @param handler
     */
    set defaultErrorHandler(handler: DefaultErrorHandlerFunction) {
        this._defaultErrorHandler = handler;
    }

    /**
     * Sets param handler.
     *
     * @param handler
     */
    set paramHandler(handler: ParamHandler) {
        this._paramHandler = handler;
    }

    /**
     * Sets metadata storage.
     *
     * @param metadataStorage
     */
    set metadataStorage(metadataStorage: MetadataStorage) {
        this._metadataStorage = metadataStorage;
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Loads all controllers from the given directory
     *
     * @param directory Directory where from load controllers
     * @param recursive Indicates if controllers are in nested directories and thy must be loaded tooo
     * @param filter Regxep to filter speficif files to load
     * @param excludeDirs Regxep to exclude some files
     * @see https://www.npmjs.com/package/require-all
     */
    loadFiles(directory: string, recursive?: boolean, filter?: RegExp, excludeDirs?: RegExp) {
        this.requireAll({ dirname: directory, filter: filter, excludeDirs: excludeDirs, recursive: recursive });
    }

    /**
     * Registers all loaded to the metadata storage controllers and their actions.
     */
    registerAllActions(): ControllerRunner {
        this.registerControllerActions(this._metadataStorage.controllerMetadatas);
        return this;
    }

    /**
     * Registers actions from the given controllers.
     */
    registerActions(classes: Function[]): ControllerRunner {
        const controllerMetadatas = this._metadataStorage.findControllerMetadatasForClasses(classes);
        this.registerControllerActions(controllerMetadatas);
        return this;
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    private registerControllerActions(controllerMetadatas: ControllerMetadata[]) {
        controllerMetadatas.forEach(controller => {
            this._metadataStorage
                .findActionMetadatasForControllerMetadata(controller)
                .forEach(action => {
                    const extraParams = this._metadataStorage.findParamMetadatasForControllerAndActionMetadata(controller, action);
                    const propertyMetadatas = this._metadataStorage.findResponsePropertyMetadatasForControllerAndActionMetadata(controller, action);
                    return this.registerAction(controller, action, propertyMetadatas, extraParams, this._metadataStorage.responseInterceptorMetadatas);
                });
        });
    }

    private registerAction(controller: ControllerMetadata,
                           action: ActionMetadata,
                           responseProperties: ResponsePropertyMetadata[],
                           params: ParamMetadata[],
                           interceptorMetadatas: ResponseInterceptorMetadata[]) {

        const path = this.buildActionPath(controller, action);
        this.framework.registerAction(path, action.type, (request: any, response: any) => {
            return this.handleAction(request, response, controller, action, responseProperties, params, interceptorMetadatas);
        });
    }

    private buildActionPath(controller: ControllerMetadata, action: ActionMetadata): string|RegExp {
        if (action.route instanceof RegExp)
            return action.route;

        let path: string = "";
        if (controller.route) path += controller.route;
        if (action.route && typeof action.route === "string") path += action.route;
        return path;
    }

    private handleAction(request: any,
                         response: any,
                         controllerMetadata: ControllerMetadata,
                         actionMetadata: ActionMetadata,
                         responsePropertyMetadatas: ResponsePropertyMetadata[],
                         paramMetadatas: ParamMetadata[],
                         interceptorMetadatas: ResponseInterceptorMetadata[]) {

        const isJson = this.isActionMustReturnJson(controllerMetadata.type, actionMetadata.options);
        const controllerObject = this.getControllerInstance(controllerMetadata);
        const interceptors = interceptorMetadatas ? this.getInterceptorInstancesFromMetadatas(interceptorMetadatas) : [];

        const contentTypeMetadata = responsePropertyMetadatas.reduce((found, property) => {
            return property.type === ResponsePropertyType.CONTENT_TYPE ? property : found;
        }, undefined);
        const locationMetadata = responsePropertyMetadatas.reduce((found, property) => {
            return property.type === ResponsePropertyType.LOCATION ? property : found;
        }, undefined);
        const redirectMetadata = responsePropertyMetadatas.reduce((found, property) => {
            return property.type === ResponsePropertyType.REDIRECT ? property : found;
        }, undefined);
        const successCodeMetadata = responsePropertyMetadatas.reduce((found, property) => {
            return property.type === ResponsePropertyType.SUCCESS_CODE ? property : found;
        }, undefined);
        const errorCodeMetadata = responsePropertyMetadatas.reduce((found, property) => {
            return property.type === ResponsePropertyType.ERROR_CODE ? property : found;
        }, undefined);
        const renderedTemplateMetadata = responsePropertyMetadatas.reduce((found, property) => {
            return property.type === ResponsePropertyType.RENDERED_TEMPLATE ? property : found;
        }, undefined);
        const headerMetadatas = responsePropertyMetadatas.filter(property => {
            return property.type === ResponsePropertyType.HEADER;
        }).map(property => ({ name: property.value, value: property.value2 }));

        const handleResultOptions: ResultHandleOptions = {
            request: request,
            response: response,
            content: undefined,
            asJson: isJson,
            successHttpCode: successCodeMetadata ? successCodeMetadata.value : undefined,
            errorHttpCode: errorCodeMetadata ? errorCodeMetadata.value : undefined,
            redirect: redirectMetadata ? redirectMetadata.value : undefined,
            headers: headerMetadatas,
            renderedTemplate: renderedTemplateMetadata ? renderedTemplateMetadata.value : undefined,
            interceptors: interceptors
        };

        if (contentTypeMetadata && contentTypeMetadata.value)
            handleResultOptions.headers.push({ name: "Content-Type", value: contentTypeMetadata.value });

        if (locationMetadata && locationMetadata.value)
            handleResultOptions.headers.push({ name: "Location", value: locationMetadata.value });

        try {
            const params = paramMetadatas
                .sort((param1, param2) => param1.index - param2.index)
                .map(param => this._paramHandler.handleParam(request, response, param));
            const result = controllerObject[actionMetadata.method].apply(controllerObject, params);

            if (result)
                this.handleResult(isJson ? result : String(result), handleResultOptions);

        } catch (error) {

            if (this.processErrorWithErrorHandler(error, isJson)) {
                this.handleError(error, handleResultOptions);
            }/* else {
                throw error;
            }*/
            throw error;
        }
    }

    private getControllerInstance(metadata: ControllerMetadata): any {
        if (this._container)
            return this._container.get(metadata.object);

        if (!metadata.instance)
            metadata.instance = new (<any>metadata.object)();
        return metadata.instance;
    }

    private getInterceptorInstancesFromMetadatas(interceptorMetadatas: ResponseInterceptorMetadata[]): ResponseInterceptorInterface[] {
        return interceptorMetadatas
            .sort(inter => inter.priority)
            .map(inter => this.getResponseInterceptorInstance(inter));
    }

    private getResponseInterceptorInstance(metadata: ResponseInterceptorMetadata): any {
        if (this._container)
            return this._container.get(metadata.object);

        if (!metadata.instance)
            metadata.instance = new (<any>metadata.object)();
        return metadata.instance;
    }

    private isActionMustReturnJson(controllerType: ControllerType, actionOptions: ActionOptions): boolean {
        if (actionOptions && actionOptions.jsonResponse)
            return true;
        if (controllerType === ControllerType.JSON && actionOptions && actionOptions.textResponse)
            return false;

        return controllerType === ControllerType.JSON;
    }

    private handleResult(result: any, options: ResultHandleOptions) {
        if (Utils.isPromise(result)) {
            result
                .then((data: any) => {
                    options.content = data;
                    this.framework.handleSuccess(options);
                })
                .catch((error: any) => {
                    this.handleError(error, options);
                    throw error;
                });
        } else {
            options.content = result;
            this.framework.handleSuccess(options);
        }
    }

    private handleError(error: any, options: ResultHandleOptions) {
        const responseError = this.processErrorWithErrorHandler(error, options.asJson);
        if (this._isLogErrorsEnabled)
            console.error(error.stack ? error.stack : error);

        options.errorHttpCode = options.errorHttpCode || 500;
        if (error instanceof HttpError && error.httpCode) {
            options.errorHttpCode = error.httpCode;
        } else if (typeof responseError === "object" && responseError.httpCode) {
            // this can be there if custom validation handler decided to return httpCode or error override map did
            options.errorHttpCode = responseError.httpCode;
            delete responseError.httpCode;
        }

        options.content = responseError;
        this.framework.handleError(options);
    }

    /**
     * Handles response error.
     *
     * @param error Error to be handled
     * @param isJson Indicates if response is json-typed or not
     * @returns {any}
     */
    private processErrorWithErrorHandler(error: any, isJson: boolean): any {
        if (isJson && this._jsonErrorHandler) {
            return this._jsonErrorHandler(error, this._isStackTraceEnabled, this.errorOverridingMap);

        } else if (!isJson && this._defaultErrorHandler) {
            return this._defaultErrorHandler(error);
        }
    }

}