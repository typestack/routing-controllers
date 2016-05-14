import {defaultMetadataArgsStorage} from "../index";
import {ActionOptions} from "./options/ActionOptions";
import {ActionTypes, ActionType} from "../metadata/types/ActionTypes";
import {ActionMetadataArgs} from "../metadata/args/ActionMetadataArgs";

/**
 * Registers an action to be executed when GET request comes on a given route.
 * Applied to controller class methods.
 * 
 * @param route When request comes to this route this action will be executed
 * @param options Extra action options to be applied
 */
export function Get(route?: RegExp, options?: ActionOptions): Function;
export function Get(route?: string, options?: ActionOptions): Function;
export function Get(route?: string|RegExp, options?: ActionOptions): Function {
    return function (object: Object, methodName: string) {
        const metadata: ActionMetadataArgs = {
            route: route,
            object: object,
            target: object.constructor,
            method: methodName,
            type: ActionTypes.GET,
            options: options
        };
        defaultMetadataArgsStorage().actions.push(metadata);
    };
}

/**
 * Registers an action to be executed when POST request comes on a given route.
 * Applied to controller class methods.
 *
 * @param route When request comes to this route this action will be executed
 * @param options Extra action options to be applied
 */
export function Post(route?: RegExp, options?: ActionOptions): Function;
export function Post(route?: string, options?: ActionOptions): Function;
export function Post(route?: string|RegExp, options?: ActionOptions): Function {
    return function (object: Object, methodName: string) {
        const metadata: ActionMetadataArgs = {
            route: route,
            object: object,
            target: object.constructor,
            method: methodName,
            type: ActionTypes.POST,
            options: options
        };
        defaultMetadataArgsStorage().actions.push(metadata);
    };
}

/**
 * Registers an action to be executed when PUT request comes on a given route.
 * Applied to controller class methods.
 *
 * @param route When request comes to this route this action will be executed
 * @param options Extra action options to be applied
 */
export function Put(route?: RegExp, options?: ActionOptions): Function;
export function Put(route?: string, options?: ActionOptions): Function;
export function Put(route?: string|RegExp, options?: ActionOptions): Function {
    return function (object: Object, methodName: string) {
        const metadata: ActionMetadataArgs = {
            route: route,
            object: object,
            target: object.constructor,
            method: methodName,
            type: ActionTypes.PUT,
            options: options
        };
        defaultMetadataArgsStorage().actions.push(metadata);
    };
}

/**
 * Registers an action to be executed when PATCH request comes on a given route.
 * Applied to controller class methods.
 *
 * @param route When request comes to this route this action will be executed
 * @param options Extra action options to be applied
 */
export function Patch(route?: RegExp, options?: ActionOptions): Function;
export function Patch(route?: string, options?: ActionOptions): Function;
export function Patch(route?: string|RegExp, options?: ActionOptions): Function {
    return function (object: Object, methodName: string) {
        const metadata: ActionMetadataArgs = {
            route: route,
            object: object,
            target: object.constructor,
            method: methodName,
            type: ActionTypes.PATCH,
            options: options
        };
        defaultMetadataArgsStorage().actions.push(metadata);
    };
}

/**
 * Registers an action to be executed when DELETE request comes on a given route.
 * Applied to controller class methods.
 *
 * @param route When request comes to this route this action will be executed
 * @param options Extra action options to be applied
 */
export function Delete(route?: RegExp, options?: ActionOptions): Function;
export function Delete(route?: string, options?: ActionOptions): Function;
export function Delete(route?: string|RegExp, options?: ActionOptions): Function {
    return function (object: Object, methodName: string) {
        const metadata: ActionMetadataArgs = {
            route: route,
            object: object,
            target: object.constructor,
            method: methodName,
            type: ActionTypes.DELETE,
            options: options
        };
        defaultMetadataArgsStorage().actions.push(metadata);
    };
}

/**
 * Registers an action to be executed when HEAD request comes on a given route.
 * Applied to controller class methods.
 *
 * @param route When request comes to this route this action will be executed
 * @param options Extra action options to be applied
 */
export function Head(route?: RegExp, options?: ActionOptions): Function;
export function Head(route?: string, options?: ActionOptions): Function;
export function Head(route?: string|RegExp, options?: ActionOptions): Function {
    return function (object: Object, methodName: string) {
        const metadata: ActionMetadataArgs = {
            route: route,
            object: object,
            target: object.constructor,
            method: methodName,
            type: ActionTypes.HEAD,
            options: options
        };
        defaultMetadataArgsStorage().actions.push(metadata);
    };
}

/**
 * Registers an action to be executed when OPTIONS request comes on a given route.
 * Applied to controller class methods.
 *
 * @param route When request comes to this route this action will be executed
 * @param options Extra action options to be applied
 */
export function Options(route?: RegExp, options?: ActionOptions): Function;
export function Options(route?: string, options?: ActionOptions): Function;
export function Options(route?: string|RegExp, options?: ActionOptions): Function {
    return function (object: Object, methodName: string) {
        const metadata: ActionMetadataArgs = {
            route: route,
            object: object,
            target: object.constructor,
            method: methodName,
            type: ActionTypes.OPTIONS,
            options: options
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
 * @param options Extra action options to be applied
 */
export function Method(method: ActionType, route?: RegExp, options?: ActionOptions): Function;
export function Method(method: ActionType, route?: string, options?: ActionOptions): Function;
export function Method(method: ActionType, route?: string|RegExp, options?: ActionOptions): Function {
    return function (object: Object, methodName: string) {
        const metadata: ActionMetadataArgs = {
            route: route,
            object: object,
            target: object.constructor,
            method: methodName,
            type: method,
            options: options
        };
        defaultMetadataArgsStorage().actions.push(metadata);
    };
}
