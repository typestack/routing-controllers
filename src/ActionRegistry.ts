import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import {ControllerUtils} from './ControllerUtils';
import {ControllerMetadata, ControllerTypes} from "./ControllerMetadata";
import {ActionMetadata, ActionTypes} from "./ActionMetadata";
import {Express} from "express";
import {ExtraParamMetadata, ExtraParamTypes} from "./ExtraParamMetadata";
import {Response} from "express";
import {Request} from "express";

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
        let controllerObject = this.container ? this.container.get(controller.object) : new (<any>controller.object)();
        let allParams = [request, response].concat(extraParams.sort((param1, param2) => param1.index - param2.index).map(param => this.handleParam(request, param)));
        let result = controllerObject[action.method].apply(controllerObject, allParams);

        if (result)
            this.handleResult(controller, response, result);
    }

    private handleParam(request: Request, extraParam: ExtraParamMetadata): any {
        switch (extraParam.type) {
            case ExtraParamTypes.BODY:
                return this.handleParamFormat(request.body, extraParam);
            case ExtraParamTypes.PARAM:
                return this.handleParamFormat(request.params[extraParam.name], extraParam);
            case ExtraParamTypes.QUERY:
                return this.handleParamFormat(request.query[extraParam.name], extraParam);
            case ExtraParamTypes.BODY_PARAM:
                return this.handleParamFormat(request.body[extraParam.name], extraParam);
            case ExtraParamTypes.COOKIE:
                return this.handleParamFormat(request.cookies[extraParam.name], extraParam);
        }
    }

    private handleParamFormat(value: any, extraParam: ExtraParamMetadata) {
        let format = extraParam.format;
        let formatName = format instanceof Function && format.name ? format.name : format instanceof String ? format : '';
        switch (formatName.toLowerCase()) {
            case 'number':
                return Number(value);
            case 'string':
                return String(value);
            case 'boolean':
                return Boolean(value);
            default:
                if (extraParam.parseJson)
                    return JSON.parse(value);
        }
        return value;
    }

    private handleResult(controller: ControllerMetadata, response: Response, result: any) {
        switch (controller.type) {
            case ControllerTypes.JSON:
                if (result.then instanceof Function)
                    ControllerUtils.jsonResponseFromPromise(response, result);
                else
                    response.json(result);
                break;
            default:
                if (result.then instanceof Function)
                    ControllerUtils.regularResponseFromPromise(response, result);
                else
                    response.send(result);

        }
    }

    private prepareControllers(controllerClasses?: any[]) {
        controllerClasses = controllerClasses ? ControllerUtils.flattenRequiredObjects(controllerClasses) : null;
        return !controllerClasses ? this.controllers : this.controllers.filter(ctrl => {
            return controllerClasses.filter(cls => ctrl.object === cls).length > 0;
        });
    }

}

/**
 * Default action registry is used as singleton and can be used to storage all action metadatas.
 */
export let defaultActionRegistry = new ActionRegistry();