import {Server} from "./server/Server";
import {ActionOptions, ActionMetadata} from "./metadata/ActionMetadata";
import {ControllerMetadata, ControllerType} from "./metadata/ControllerMetadata";
import {MetadataStorage, defaultMetadataStorage} from "./metadata/MetadataStorage";
import {Utils} from "./Utils";
import {ParamMetadata} from "./metadata/ParamMetadata";
import {HttpCodeMetadata} from "./metadata/HttpCodeMetadata";
import {ParamHandler} from "./ParamHandler";
import {HttpError} from "./error/http/HttpError";
import {jsonErrorHandler, defaultErrorHandler} from "./ErrorHandlers";
import {ResponseInterceptorInterface} from "./interceptor/ResponseInterceptorInterface";
import {ResponseInterceptorMetadata} from "./metadata/ResponseInterceptorMetadata";
import {ResultHandleOptions} from "./ResultHandleOptions";

export type Container = { get(someClass: any): any };
export type JsonErrorHandlerFunction = (error: any, isDebug: boolean, errorOverridingMap: any) => any;
export type DefaultErrorHandlerFunction = (error: any) => any;

/**
 * Registers controllers and actions in the given server framework.
 */
export class ControllerRunner {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private _container: Container;
    private _metadataStorage: MetadataStorage = defaultMetadataStorage;
    private _paramHandler: ParamHandler;
    private _isLogErrorsEnabled: boolean;
    private _isStackTraceEnabled: boolean;
    private _errorOverridingMap: Object;
    private _jsonErrorHandler: JsonErrorHandlerFunction = jsonErrorHandler;
    private _defaultErrorHandler: DefaultErrorHandlerFunction = defaultErrorHandler;

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
     * Sets the overriding map that will be used to override errors.
     *
     * @param map
     */
    set errorOverridingMap(map: Object) {
        this._errorOverridingMap = map;
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
        require('require-all')({ dirname: directory, filter: filter, excludeDirs: excludeDirs, recursive: recursive });
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
                    const extraParams = this._metadataStorage.findParamMetadatasMetadatasForControllerAndActionMetadata(controller, action);
                    const httpCode = this._metadataStorage.findHttpCodeMetadatasMetadatasForControllerAndActionMetadata(controller, action);
                    return this.registerAction(controller, action, httpCode, extraParams, this._metadataStorage.responseInterceptorMetadatas);
                });
        });
    }

    private registerAction(controller: ControllerMetadata,
                           action: ActionMetadata,
                           httpCode: HttpCodeMetadata,
                           params: ParamMetadata[],
                           interceptorMetadatas: ResponseInterceptorMetadata[]) {

        const path = this.buildActionPath(controller, action);
        this.framework.registerAction(path, action.type, (request: any, response: any) => {
            return this.handleAction(request, response, controller, action, httpCode, params, interceptorMetadatas);
        });
    }

    private buildActionPath(controller: ControllerMetadata, action: ActionMetadata): string|RegExp {
        if (action.route instanceof RegExp)
            return action.route;

        let path: string = '';
        if (controller.route) path += controller.route;
        if (action.route && typeof action.route === 'string') path += action.route;
        return path;
    }

    private handleAction(request: any,
                         response: any,
                         controllerMetadata: ControllerMetadata,
                         actionMetadata: ActionMetadata,
                         httpCodeMetadata: HttpCodeMetadata,
                         paramMetadatas: ParamMetadata[],
                         interceptorMetadatas: ResponseInterceptorMetadata[]) {

        const isJson = this.isActionMustReturnJson(controllerMetadata.type, actionMetadata.options);
        const controllerObject = this.getControllerInstance(controllerMetadata);
        const interceptors = interceptorMetadatas ? this.getInterceptorInstancesFromMetadatas(interceptorMetadatas) : [];
        const handleResultOptions: ResultHandleOptions = {
            request: request,
            response: response,
            content: undefined,
            asJson: isJson,
            httpCode: httpCodeMetadata ? httpCodeMetadata.code : undefined,
            interceptors: interceptors
        };

        try {
            const params = paramMetadatas
                .sort((param1, param2) => param1.index - param2.index)
                .map(param => this._paramHandler.handleParam(request, response, param));
            const result = controllerObject[actionMetadata.method].apply(controllerObject, params);

            if (result) {
                handleResultOptions.content = isJson ? result : String(result);
                this.handleResult(handleResultOptions);
            }

        } catch (error) {

            if (this.processErrorWithErrorHandler(error, isJson)) {
                handleResultOptions.content = error;
                this.handleError(handleResultOptions);
            } else {
                throw error;
            }
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

    private handleResult(options: ResultHandleOptions) {
        if (Utils.isPromise(options.content)) {
            options.content
                .then((result: any) => this.framework.handleSuccess({
                    request: options.request,
                    response: options.response,
                    httpCode: options.httpCode,
                    content: result,
                    asJson: options.asJson,
                    interceptors: options.interceptors
                }))
                .catch((error: any) => this.handleError(options));
        } else {
            this.framework.handleSuccess(options);
        }
    }

    private handleError(options: ResultHandleOptions) {
        const error = options.content;
        const responseError = this.processErrorWithErrorHandler(error, options.asJson);
        if (this._isLogErrorsEnabled)
            console.error(error.stack ? error.stack : error);

        options.httpCode = 500;
        if (error instanceof HttpError && error.httpCode) {
            options.httpCode = error.httpCode;
        } else if (typeof responseError === 'object' && responseError.httpCode) {
            // this can be there if custom validation handler decided to return httpCode or error override map did
            options.httpCode = responseError.httpCode;
            delete responseError.httpCode;
        }

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
            return this._jsonErrorHandler(error, this._isStackTraceEnabled, this._errorOverridingMap);

        } else if (!isJson && this._defaultErrorHandler) {
            return this._defaultErrorHandler(error);
        }
    }

}