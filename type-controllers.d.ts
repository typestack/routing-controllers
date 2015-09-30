declare module 'type-controllers/ActionMetadata' {
	export interface ActionMetadata {
	    path: string;
	    object: any;
	    method: string;
	    type: number;
	}
	export enum ActionTypes {
	    GET = 1,
	    POST = 2,
	    PUT = 3,
	    PATCH = 4,
	    DELETE = 5,
	}

}
declare module 'type-controllers/ControllerUtils' {
	import { Response } from "express";
	/**
	 * Common controller utilities.
	 */
	export class ControllerUtils {
	    /**
	     * Makes "require()" all js files (or custom extension files) in the given directory.
	     */
	    static requireAll(directories: string[], extension?: string): any[];
	    static jsonResponseFromPromise(response: Response, promise: {
	        then(result: any, error: any): any;
	    }): any;
	    static regularResponseFromPromise(response: Response, promise: {
	        then(result: any, error: any): any;
	    }): any;
	    static flattenRequiredObjects(requiredObjects: any[]): any;
	}

}
declare module 'type-controllers/ControllerMetadata' {
	export interface ControllerMetadata {
	    path: string;
	    object: Function;
	    type: number;
	}
	export enum ControllerTypes {
	    DEFAULT = 0,
	    JSON = 1,
	}

}
declare module 'type-controllers/ExtraParamMetadata' {
	export interface ExtraParamMetadata {
	    object: any;
	    methodName: string;
	    index: number;
	    type: number;
	    name?: string;
	    format?: any;
	    parseJson: boolean;
	}
	export enum ExtraParamTypes {
	    BODY = 1,
	    QUERY = 2,
	    BODY_PARAM = 3,
	    PARAM = 4,
	    COOKIE = 5,
	}

}
declare module 'type-controllers/ActionRegistry' {
	import { ControllerMetadata } from 'type-controllers/ControllerMetadata';
	import { ActionMetadata } from 'type-controllers/ActionMetadata';
	import { Express } from "express";
	import { ExtraParamMetadata } from 'type-controllers/ExtraParamMetadata';
	/**
	 * Registry for all controllers and actions.
	 */
	export class ActionRegistry {
	    private _container;
	    private controllers;
	    private actions;
	    private extraParams;
	    /**
	     * Sets a container that can be used in your controllers. This allows you to inject services in your
	     * controllers.
	     */
	    container: {
	        get(someClass: any): any;
	    };
	    addController(controller: ControllerMetadata): void;
	    addAction(action: ActionMetadata): void;
	    addExtraParam(extra: ExtraParamMetadata): void;
	    /**
	     * Registers actions in the given express application. If specific controller classes are given then only
	     * actions of those controllers will be loaded to the given application.
	     */
	    registerActions(app: Express, controllerClasses?: any[]): void;
	    private registerAction(app, controller, action);
	    private buildPath(controller, action);
	    private handleAction(request, response, controller, action, extraParams);
	    private handleParam(request, extraParam);
	    private handleParamFormat(value, extraParam);
	    private handleResult(controller, response, result);
	    private prepareControllers(controllerClasses?);
	}
	/**
	 * Default action registry is used as singleton and can be used to storage all action metadatas.
	 */
	export let defaultActionRegistry: ActionRegistry;

}
declare module 'type-controllers/Annotations' {
	/// <reference path="../node_modules/reflect-metadata/reflect-metadata.d.ts" />
	export function JsonController(path?: string): (object: Function) => void;
	export function Controller(path?: string): (object: Function) => void;
	export function Get(path?: string): (object: Object, methodName: string) => void;
	export function Post(path?: string): (object: Object, methodName: string) => void;
	export function Put(path?: string): (object: Object, methodName: string) => void;
	export function Patch(path?: string): (object: Object, methodName: string) => void;
	export function Delete(path?: string): (object: Object, methodName: string) => void;
	export function Body(parseJson?: boolean): (object: Object, methodName: string, index: number) => void;
	export function Param(name: string, parseJson?: boolean): (object: Object, methodName: string, index: number) => void;
	export function QueryParam(name: string, parseJson?: boolean): (object: Object, methodName: string, index: number) => void;
	export function BodyParam(name: string, parseJson?: boolean): (object: Object, methodName: string, index: number) => void;
	export function CookieParam(name: string, parseJson?: boolean): (object: Object, methodName: string, index: number) => void;

}
