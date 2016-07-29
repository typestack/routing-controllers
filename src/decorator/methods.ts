import {defaultMetadataArgsStorage} from "../index";
import {ActionTypes, ActionType} from "../metadata/types/ActionTypes";
import {ActionMetadataArgs} from "../metadata/args/ActionMetadataArgs";

/**
 * Registers an action to be executed when GET request comes on a given route.
 * Applied to controller class methods.
 * 
 * @param route When request comes to this route this action will be executed
 */
export function Get(route?: RegExp): Function;
export function Get(route?: string): Function;
export function Get(route?: string|RegExp): Function {
    return function (object: Object, methodName: string) {
        const metadata: ActionMetadataArgs = {
            route: route,
            target: object.constructor,
            method: methodName,
            type: ActionTypes.GET
        };
        defaultMetadataArgsStorage().actions.push(metadata);
    };
}

/**
 * Registers an action to be executed when POST request comes on a given route.
 * Applied to controller class methods.
 *
 * @param route When request comes to this route this action will be executed
 */
export function Post(route?: RegExp): Function;
export function Post(route?: string): Function;
export function Post(route?: string|RegExp): Function {
    return function (object: Object, methodName: string) {
        const metadata: ActionMetadataArgs = {
            route: route,
            target: object.constructor,
            method: methodName,
            type: ActionTypes.POST
        };
        defaultMetadataArgsStorage().actions.push(metadata);
    };
}

/**
 * Registers an action to be executed when PUT request comes on a given route.
 * Applied to controller class methods.
 *
 * @param route When request comes to this route this action will be executed
 */
export function Put(route?: RegExp): Function;
export function Put(route?: string): Function;
export function Put(route?: string|RegExp): Function {
    return function (object: Object, methodName: string) {
        const metadata: ActionMetadataArgs = {
            route: route,
            target: object.constructor,
            method: methodName,
            type: ActionTypes.PUT
        };
        defaultMetadataArgsStorage().actions.push(metadata);
    };
}

/**
 * Registers an action to be executed when PATCH request comes on a given route.
 * Applied to controller class methods.
 *
 * @param route When request comes to this route this action will be executed
 */
export function Patch(route?: RegExp): Function;
export function Patch(route?: string): Function;
export function Patch(route?: string|RegExp): Function {
    return function (object: Object, methodName: string) {
        const metadata: ActionMetadataArgs = {
            route: route,
            target: object.constructor,
            method: methodName,
            type: ActionTypes.PATCH
        };
        defaultMetadataArgsStorage().actions.push(metadata);
    };
}

/**
 * Registers an action to be executed when DELETE request comes on a given route.
 * Applied to controller class methods.
 *
 * @param route When request comes to this route this action will be executed
 */
export function Delete(route?: RegExp): Function;
export function Delete(route?: string): Function;
export function Delete(route?: string|RegExp): Function {
    return function (object: Object, methodName: string) {
        const metadata: ActionMetadataArgs = {
            route: route,
            target: object.constructor,
            method: methodName,
            type: ActionTypes.DELETE
        };
        defaultMetadataArgsStorage().actions.push(metadata);
    };
}

/**
 * Registers an action to be executed when HEAD request comes on a given route.
 * Applied to controller class methods.
 *
 * @param route When request comes to this route this action will be executed
 */
export function Head(route?: RegExp): Function;
export function Head(route?: string): Function;
export function Head(route?: string|RegExp): Function {
    return function (object: Object, methodName: string) {
        const metadata: ActionMetadataArgs = {
            route: route,
            target: object.constructor,
            method: methodName,
            type: ActionTypes.HEAD
        };
        defaultMetadataArgsStorage().actions.push(metadata);
    };
}

/**
 * Registers an action to be executed when request with specified method comes on a given route.
 * Applied to controller class methods.
 *
 * @param method Http method to be registered. All avalible http methods are listed in ActionType class
 * @param route When request comes to this route this action will be executed
 */
export function Method(method: ActionType, route?: RegExp): Function;
export function Method(method: ActionType, route?: string): Function;
export function Method(method: ActionType, route?: string|RegExp): Function {
    return function (object: Object, methodName: string) {
        const metadata: ActionMetadataArgs = {
            route: route,
            target: object.constructor,
            method: methodName,
            type: method
        };
        defaultMetadataArgsStorage().actions.push(metadata);
    };
}
