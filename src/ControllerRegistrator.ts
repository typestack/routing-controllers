import {Driver} from "./server/Server";
import {ActionMetadata} from "./metadata/ActionMetadata";
import {ControllerMetadata} from "./metadata/ControllerMetadata";
import {Utils} from "./Utils";
import {ParamMetadata} from "./metadata/ParamMetadata";
import {ResponseHandleMetadata} from "./metadata/ResponseHandleMetadata";
import {ParamHandler} from "./ParamHandler";
import {HttpError} from "./error/http/HttpError";
import {jsonErrorHandler, defaultErrorHandler} from "./ErrorHandlers";
import {MiddlewareInterface} from "./middleware/MiddlewareInterface";
import {MiddlewareMetadata} from "./metadata/MiddlewareMetadata";
import {ResultHandleOptions} from "./ResultHandleOptions";
import {constructorToPlain} from "constructor-utils";
import {defaultMetadataStorage, getContainer} from "./index";
import {ActionOptions} from "./decorator/options/ActionOptions";
import {ResponseHandleTypes} from "./metadata/types/ResponsePropertyTypes";

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

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private driver: Driver) {
        this.paramHandler = new ParamHandler(driver);
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Registers all loaded to the metadata storage controllers and their actions.
     */
    registerAllActions(): this {
        this.registerControllerActions(defaultMetadataStorage().controllerMetadatas);
        return this;
    }

    /**
     * Registers actions from the given controllers.
     */
    registerActions(classes: Function[]): this {
        const controllerMetadatas = defaultMetadataStorage().findControllerMetadatasForClasses(classes);
        this.registerControllerActions(controllerMetadatas);
        return this;
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    private registerControllerActions(controllerMetadatas: ControllerMetadata[]) {
        const metadataStorage = defaultMetadataStorage();
        controllerMetadatas.forEach(controller => {
            metadataStorage
                .findActionMetadatasForControllerMetadata(controller)
                .forEach(action => {
                    const extraParams = metadataStorage.findParamMetadatasForControllerAndActionMetadata(controller, action);
                    const propertyMetadatas = metadataStorage.findResponsePropertyMetadatasForControllerAndActionMetadata(controller, action);
                    this.registerAction(controller, action, propertyMetadatas, extraParams, metadataStorage.middlewareMetadatas);
                });
        });
    }

    private registerAction(controller: ControllerMetadata,
                           action: ActionMetadata,
                           responseProperties: ResponseHandleMetadata[],
                           params: ParamMetadata[],
                           interceptorMetadatas: MiddlewareMetadata[]) {

        const path = this.buildActionPath(controller, action);
        this.driver.registerAction(path, action.type, (request: any, response: any) => {
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
                         responsePropertyMetadatas: ResponseHandleMetadata[],
                         paramMetadatas: ParamMetadata[],
                         interceptorMetadatas: MiddlewareMetadata[]) {

        const isJson = this.isActionMustReturnJson(controllerMetadata.type, actionMetadata.options);
        const controllerInstance = getContainer().get<any>(controllerMetadata.object);
        const interceptors = interceptorMetadatas ? this.getInterceptorInstancesFromMetadatas(interceptorMetadatas) : [];

        const contentTypeMetadata = responsePropertyMetadatas.reduce((found, property) => {
            return property.type === ResponseHandleTypes.CONTENT_TYPE ? property : found;
        }, undefined);
        const locationMetadata = responsePropertyMetadatas.reduce((found, property) => {
            return property.type === ResponseHandleTypes.LOCATION ? property : found;
        }, undefined);
        const redirectMetadata = responsePropertyMetadatas.reduce((found, property) => {
            return property.type === ResponseHandleTypes.REDIRECT ? property : found;
        }, undefined);
        const successCodeMetadata = responsePropertyMetadatas.reduce((found, property) => {
            return property.type === ResponseHandleTypes.SUCCESS_CODE ? property : found;
        }, undefined);
        const emptyResultCodeMetadata = responsePropertyMetadatas.reduce((found, property) => {
            return property.type === ResponseHandleTypes.EMPTY_RESULT_CODE ? property : found;
        }, undefined);
        const nullResultCodeMetadata = responsePropertyMetadatas.reduce((found, property) => {
            return property.type === ResponseHandleTypes.NULL_RESULT_CODE ? property : found;
        }, undefined);
        const undefinedResultCodeMetadata = responsePropertyMetadatas.reduce((found, property) => {
            return property.type === ResponseHandleTypes.UNDEFINED_RESULT_CODE ? property : found;
        }, undefined);
        const errorCodeMetadata = responsePropertyMetadatas.reduce((found, property) => {
            return property.type === ResponseHandleTypes.ERROR_CODE ? property : found;
        }, undefined);
        const renderedTemplateMetadata = responsePropertyMetadatas.reduce((found, property) => {
            return property.type === ResponseHandleTypes.RENDERED_TEMPLATE ? property : found;
        }, undefined);
        const headerMetadatas = responsePropertyMetadatas.filter(property => {
            return property.type === ResponseHandleTypes.HEADER;
        }).map(property => ({ name: property.primaryValue, value: property.secondaryValue }));

        const handleResultOptions: ResultHandleOptions = {
            request: request,
            response: response,
            content: undefined,
            asJson: isJson,
            successHttpCode: successCodeMetadata ? successCodeMetadata.primaryValue : undefined,
            errorHttpCode: errorCodeMetadata ? errorCodeMetadata.primaryValue : undefined,
            emptyResultCode: emptyResultCodeMetadata ? emptyResultCodeMetadata.primaryValue : undefined,
            nullResultCode: nullResultCodeMetadata ? nullResultCodeMetadata.primaryValue : undefined,
            undefinedResultCode: undefinedResultCodeMetadata ? undefinedResultCodeMetadata.primaryValue : undefined,
            redirect: redirectMetadata ? redirectMetadata.primaryValue : undefined,
            headers: headerMetadatas,
            renderedTemplate: renderedTemplateMetadata ? renderedTemplateMetadata.primaryValue : undefined,
            interceptors: interceptors
        };

        if (contentTypeMetadata && contentTypeMetadata.primaryValue)
            handleResultOptions.headers.push({ name: "Content-Type", value: contentTypeMetadata.primaryValue });

        if (locationMetadata && locationMetadata.primaryValue)
            handleResultOptions.headers.push({ name: "Location", value: locationMetadata.primaryValue });

        const paramsPromises = paramMetadatas
            .sort((param1, param2) => param1.index - param2.index)
            .map(param => {
                return this.paramHandler.handleParam(request, response, param, handleResultOptions);
            });
        Promise.all(paramsPromises).then(params => {
            const result = controllerInstance[actionMetadata.method].apply(controllerInstance, params);

            if (result)
                this.handleResult(isJson ? result : String(result), handleResultOptions);

        }).catch(error => {

            if (this.processErrorWithErrorHandler(error, isJson)) {
                this.handleError(error, handleResultOptions);
            }/* else {
                throw error;
            }*/
            throw error;
        });
    }

    private getInterceptorInstancesFromMetadatas(interceptorMetadatas: MiddlewareMetadata[]): MiddlewareInterface[] {
        return interceptorMetadatas
            .sort(inter => inter.priority)
            .map(inter => getContainer().get<MiddlewareInterface>(inter.target));
    }

    private isActionMustReturnJson(controllerType: "default"|"json", actionOptions: ActionOptions): boolean {
        if (actionOptions && actionOptions.jsonResponse)
            return true;
        if (controllerType === "json" && actionOptions && actionOptions.textResponse)
            return false;

        return controllerType === "json";
    }

    private handleResult(result: any, options: ResultHandleOptions) {
        if (Utils.isPromise(result)) {
            result
                .then((data: any) => {
                    if (data && data instanceof Object) {
                        options.content = constructorToPlain(data);
                    } else {
                        options.content = data;
                    }
                    this.driver.handleSuccess(options);
                })
                .catch((error: any) => {
                    this.handleError(error, options);
                    throw error;
                });
        } else {
            if (result && result instanceof Object) {
                options.content = constructorToPlain(result);
            } else {
                options.content = result;
            }
            this.driver.handleSuccess(options);
        }
    }

    private handleError(error: any, options: ResultHandleOptions) {
        const responseError = this.processErrorWithErrorHandler(error, options.asJson);
        if (this.isLogErrorsEnabled)
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
        this.driver.handleError(options);
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