import {HttpFramework} from "./http-framework-integration/HttpFramework";
import {ActionMetadata} from "./metadata/ActionMetadata";
import {ControllerMetadata, ControllerType} from "./metadata/ControllerMetadata";
import {MetadataStorage, defaultMetadataStorage} from "./metadata/MetadataStorage";
import {Utils} from "./Utils";
import {ParamMetadata} from "./metadata/ParamMetadata";
import {HttpCodeMetadata} from "./metadata/HttpCodeMetadata";
import {ParamHandler} from "./ParamHandler";
import {ActionOptions} from "./metadata/ActionMetadata";
import {HttpError} from "./error/http/HttpError";
import {jsonErrorHandler, defaultErrorHandler} from "./ErrorHandlers";
import {ResponseInterceptorInterface} from "./ResponseInterceptorInterface";
import {ResponseInterceptorMetadata} from "./metadata/ResponseInterceptorMetadata";

export type Container = { get(someClass: any): any };
export type JsonErrorHandlerFunction = (error: any, isDebug: boolean, errorOverridingMap: any) => any;
export type DefaultErrorHandlerFunction = (error: any) => any;

/**
 * Storage all controllers metadata.
 */
export class ControllerRunner {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private _container: Container;
    private _isLogErrorsEnabled: boolean;
    private _isStackTraceEnabled: boolean;
    private _errorOverridingMap: any;
    private _jsonErrorHandler: JsonErrorHandlerFunction = jsonErrorHandler;
    private _defaultErrorHandler: DefaultErrorHandlerFunction = defaultErrorHandler;

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    constructor(private framework: HttpFramework,
                private paramHandler?: ParamHandler,
                private metadataStorage?: MetadataStorage) {

        if (!metadataStorage)
            this.metadataStorage = defaultMetadataStorage;
        if (!paramHandler)
            this.paramHandler = new ParamHandler(framework);
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

    set isLogErrorsEnabled(isEnabled: boolean) {
        this._isLogErrorsEnabled = isEnabled;
    }

    set isStackTraceEnabled(isEnabled: boolean) {
        this._isStackTraceEnabled = isEnabled;
    }

    set errorOverridingMap(map: any) {
        this._errorOverridingMap = map;
    }

    set jsonErrorHandler(handler: JsonErrorHandlerFunction) {
        this._jsonErrorHandler = handler;
    }

    set defaultErrorHandler(handler: DefaultErrorHandlerFunction) {
        this._defaultErrorHandler = handler;
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Registers all loaded to the metadata storage controllers and their actions.
     */
    registerAllActions(): ControllerRunner {
        this.registerControllerActions(this.metadataStorage.controllerMetadatas);
        return this;
    }

    /**
     * Registers actions from the given controllers.
     */
    registerActions(controllerClasses: any[]): ControllerRunner {
        const classes = Utils.flattenRequiredObjects(Utils.flattenRequiredObjects(controllerClasses));
        const controllerMetadatas = this.metadataStorage.findControllerMetadatasForClasses(classes);
        this.registerControllerActions(controllerMetadatas);
        return this;
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    private registerControllerActions(controllerMetadatas: ControllerMetadata[]) {
        controllerMetadatas.forEach(controller => {
            this.metadataStorage
                .findActionMetadatasForControllerMetadata(controller)
                .forEach(action => {
                    const extraParams = this.metadataStorage.findParamMetadatasMetadatasForControllerAndActionMetadata(controller, action);
                    const httpCode = this.metadataStorage.findHttpCodeMetadatasMetadatasForControllerAndActionMetadata(controller, action);
                    return this.registerAction(controller, action, httpCode, extraParams, this.metadataStorage.responseInterceptorMetadatas);
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
        if (action.path && action.path instanceof RegExp)
            return action.path;

        let path: string = '';
        if (controller.path) path += controller.path;
        if (action.path && typeof action.path === 'string') path += action.path;
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
        const interceptors: ResponseInterceptorInterface[] =
            interceptorMetadatas ? interceptorMetadatas
                .sort(inter => inter.priority)
                .map(inter => this.getResponseInterceptorInstance(inter))
            : [];

        try {
            const params = paramMetadatas
                .sort((param1, param2) => param1.index - param2.index)
                .map(param => this.paramHandler.handleParam(request, response, param));
            const result = controllerObject[actionMetadata.method].apply(controllerObject, params);

            if (result)
                this.handleResult(request, response, result, httpCodeMetadata ? httpCodeMetadata.code : undefined, isJson, interceptors);
        } catch (error) {

            if (this.getResponseHandledError(error, isJson)) {
                this.handleError(request, response, error, isJson, interceptors);
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

    private handleResult(request: any, response: any, result: any, successHttpCode: number, isJson: boolean, interceptors: ResponseInterceptorInterface[]) {
        if (result.then instanceof Function && result.catch instanceof Function) {
            result.then(
                (result: any) => this.framework.handleSuccess(request, response, result, isJson, successHttpCode, interceptors),
                (error: any) => this.handleError(request, response, error, isJson, interceptors)
            );
        } else {
            this.framework.handleSuccess(request, response, result, isJson, successHttpCode, interceptors);
        }
    }

    private handleError(request: any, response: any, error: any, isJson: boolean, interceptors: ResponseInterceptorInterface[]) {
        const responseError = this.getResponseHandledError(error, isJson);
        if (this._isLogErrorsEnabled)
            console.error(error.stack ? error.stack : error);
        let errorHttpCode = 500;
        if (error instanceof HttpError && error.httpCode) {
            errorHttpCode = error.httpCode;
        } else if (typeof responseError === 'object' && responseError.httpCode) {
            // this can be there if custom validation handler decided to return httpCode or error override map did
            errorHttpCode = responseError.httpCode;
            delete responseError.httpCode;
        }

        this.framework.handleError(request, response, responseError, isJson, errorHttpCode, interceptors);
    }

    private getResponseHandledError(error: any, isJson: boolean): any {
        if (this._jsonErrorHandler && isJson) {
            return this._jsonErrorHandler(error, this._isStackTraceEnabled, this._errorOverridingMap);

        } else if (this._defaultErrorHandler && !isJson) {
            return this._defaultErrorHandler(error);
        }
    }
}