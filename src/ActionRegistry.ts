import * as fs from 'fs';
import * as path from 'path';
import * as express from 'express';
import {Express} from "express";
import {Response} from "express";
import {Request} from "express";
import {ControllerUtils} from './ControllerUtils';
import {ControllerMetadata, ControllerTypes} from "./ControllerMetadata";
import {ActionMetadata, ActionTypes} from "./ActionMetadata";
import {ExtraParamMetadata, ExtraParamTypes} from "./ExtraParamMetadata";
import {ParameterParseJsonException} from "./exception/ParameterParseJsonException";
import {ParameterRequiredException} from "./exception/ParameterRequiredException";
import {BodyRequiredException} from "./exception/BodyRequiredException";

/**
 * Registry for all controllers and actions.
 */
export class ActionRegistry {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private _container: { get(someClass: any): any };
    private controllers: ControllerMetadata[] = [];
    private actions: ActionMetadata[] = [];
    private extraParams: ExtraParamMetadata[] = [];
    private _isLogErrorsEnabled = true;

    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------

    /**
     * Sets a container that can be used in your controllers. This allows you to inject services in your
     * controllers.
     */
    set container(container: { get(someClass: any): any }) {
        this._container = container;
    }

    set isLogErrorsEnabled(isEnabled: boolean) {
        this._isLogErrorsEnabled = isEnabled;
    }

    // -------------------------------------------------------------------------
    // Adder Methods
    // -------------------------------------------------------------------------

    addController(controller: ControllerMetadata) {
        this.controllers.push(controller);
    }

    addAction(action: ActionMetadata) {
        this.actions.push(action);
    }

    addExtraParam(extra: ExtraParamMetadata) {
        this.extraParams.push(extra);
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Registers actions in the given express application. If specific controller classes are given then only
     * actions of those controllers will be loaded to the given application.
     */
    registerActions(app: Express, controllerClasses?: any[]) {
        let controllers = this.prepareControllers(controllerClasses);
        controllers.forEach(controller => {
            this.actions
                .filter(action => action.object.constructor === controller.object)
                .forEach(action => this.registerAction(app, controller, action));
        });
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    private registerAction(app: Express, controller: ControllerMetadata, action: ActionMetadata) {
        let path = this.buildPath(controller, action);
        let extraParams = this.extraParams.filter(param => param.object.constructor === controller.object && param.methodName === action.method);

        switch (action.type) {
            case ActionTypes.GET:
                app.get(path, (request, response) => this.handleAction(request, response, controller, action, extraParams));
                break;
            case ActionTypes.POST:
                app.post(path, (request, response) => this.handleAction(request, response, controller, action, extraParams));
                break;
            case ActionTypes.PUT:
                app.put(path, (request, response) => this.handleAction(request, response, controller, action, extraParams));
                break;
            case ActionTypes.PATCH:
                app.patch(path, (request, response) => this.handleAction(request, response, controller, action, extraParams));
                break;
            case ActionTypes.DELETE:
                app.delete(path, (request, response) => this.handleAction(request, response, controller, action, extraParams));
                break;
        }
    }

    private buildPath(controller: ControllerMetadata, action: ActionMetadata): string {
        let path = '';
        if (controller.path) path += controller.path;
        if (action.path) path += action.path;
        return path;
    }

    private handleAction(request: Request, response: Response, controller: ControllerMetadata, action: ActionMetadata, extraParams: ExtraParamMetadata[]) {
        let controllerObject = this._container ? this._container.get(controller.object) : new (<any>controller.object)();
        let allParams = [request, response].concat(extraParams.sort((param1, param2) => param1.index - param2.index).map(param => this.handleParam(request, param)));
        let result = controllerObject[action.method].apply(controllerObject, allParams);

        if (result)
            this.handleResult(controller, response, result);
    }

    private handleParam(request: Request, extraParam: ExtraParamMetadata): any {
        let value: any;
        switch (extraParam.type) {
            case ExtraParamTypes.BODY:
                value = this.handleParamFormat(request.body, extraParam);
                break;
            case ExtraParamTypes.PARAM:
                value = this.handleParamFormat(request.params[extraParam.name], extraParam);
                break;
            case ExtraParamTypes.QUERY:
                value = this.handleParamFormat(request.query[extraParam.name], extraParam);
                break;
            case ExtraParamTypes.BODY_PARAM:
                value = this.handleParamFormat(request.body[extraParam.name], extraParam);
                break;
            case ExtraParamTypes.COOKIE:
                value = this.handleParamFormat(request.cookies[extraParam.name], extraParam);
                break;
        }

        if (extraParam.name && extraParam.isRequired && (value === null || value === undefined)) {
            throw new ParameterRequiredException(request.url, request.method, extraParam.name);
        } else if (!extraParam.name && extraParam.isRequired && (value === null || value === undefined || (value instanceof Object && Object.keys(value).length === 0))) {
            throw new BodyRequiredException(request.url, request.method);
        }

        return value;
    }

    private handleParamFormat(value: any, extraParam: ExtraParamMetadata) {
        let format = extraParam.format;
        let formatName = format instanceof Function && format.name ? format.name : format instanceof String ? format : '';
        switch (formatName.toLowerCase()) {
            case 'number':
                return +value;
            case 'string':
                return value;
            case 'boolean':
                return !!value;
            default:
                if (value && extraParam.parseJson) {
                    try {
                        value = JSON.parse(value);
                    } catch (er) {
                        throw new ParameterParseJsonException(extraParam.name, value);
                    }
                }
        }
        return value;
    }

    private handleResult(controller: ControllerMetadata, response: Response, result: any) {
        switch (controller.type) {
            case ControllerTypes.JSON:
                if (result.then instanceof Function && result.catch instanceof Function) {
                    this.jsonResponseFromPromise(response, result);
                } else {
                    if (result !== null && result !== undefined) {
                        response.json(result);
                    } else {
                        response.end();
                    }
                }
                break;
            default:
                if (result.then instanceof Function && result.catch instanceof Function) {
                    this.regularResponseFromPromise(response, result);
                } else {
                    if (result !== null && result !== undefined) {
                        response.send(String(result));
                    } else {
                        response.end();
                    }
                }
        }
    }

    private prepareControllers(controllerClasses?: any[]) {
        controllerClasses = controllerClasses ? ControllerUtils.flattenRequiredObjects(controllerClasses) : null;
        return !controllerClasses ? this.controllers : this.controllers.filter(ctrl => {
            return controllerClasses.filter(cls => ctrl.object === cls).length > 0;
        });
    }

    private jsonResponseFromPromise(response: Response, promise: { then(result: any, error: any): any }) {
        return promise.then((result: any) => {
            if (result !== null && result !== undefined) {
                response.json(result);
            } else {
                response.end();
            }

        }, (error: any) => {
            if (error) {
                if (this._isLogErrorsEnabled)
                    console.error(error.stack ? error.stack : error);
                response.status(500);
                response.json(error);
            } else {
                response.end();
            }


            // todo: implement custom error catchers
            //this._errorCatcher = (error: any) => {
            //    if (this.configuration.debugMode) {
            //        console.log(error.stack ? error.stack : error);
            //    } else {
            //        console.log(error.message ? error.message : error);
            //    }
            //};

        });
    }

    private regularResponseFromPromise(response: Response, promise: { then(result: any, error: any): any }) {
        return promise.then((result: any) => {
            if (result !== null && result !== undefined) {
                response.send(String(result));
            } else {
                response.end();
            }

        }, (error: any) => {

            if (error) {
                if (this._isLogErrorsEnabled)
                    console.error(error.stack ? error.stack : error);
                response.status(500);
                response.send(error);
            } else {
                response.end();
            }

        });
    }

}

/**
 * Default action registry is used as singleton and can be used to storage all action metadatas.
 */
export let defaultActionRegistry = new ActionRegistry();