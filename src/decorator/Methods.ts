import "reflect-metadata";
import {defaultMetadataStorage} from "./../metadata/MetadataStorage";
import {ActionType} from "./../metadata/ActionMetadata";
import {ResponsePropertyType} from "./../metadata/ResponsePropertyMetadata";
import {ControllerType} from "./../metadata/ControllerMetadata";
import {ParamType, ParamOptions} from "./../metadata/ParamMetadata";
import {ActionOptions} from "./../metadata/ActionMetadata";

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
        defaultMetadataStorage.addActionMetadata({
            route: route,
            object: object,
            method: methodName,
            type: ActionType.GET,
            options: options
        });
    }
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
        defaultMetadataStorage.addActionMetadata({
            route: route,
            object: object,
            method: methodName,
            type: ActionType.POST,
            options: options
        });
    }
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
        defaultMetadataStorage.addActionMetadata({
            route: route,
            object: object,
            method: methodName,
            type: ActionType.PUT,
            options: options
        });
    }
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
        defaultMetadataStorage.addActionMetadata({
            route: route,
            object: object,
            method: methodName,
            type: ActionType.PATCH,
            options: options
        });
    }
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
        defaultMetadataStorage.addActionMetadata({
            route: route,
            object: object,
            method: methodName,
            type: ActionType.DELETE,
            options: options
        });
    }
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
        defaultMetadataStorage.addActionMetadata({
            route: route,
            object: object,
            method: methodName,
            type: ActionType.HEAD,
            options: options
        });
    }
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
        defaultMetadataStorage.addActionMetadata({
            route: route,
            object: object,
            method: methodName,
            type: ActionType.OPTIONS,
            options: options
        });
    }
}

/**
 * Registers an action to be executed when request with specified method comes on a given route.
 * Applied to controller class methods.
 *
 * @param method Http method to be registered. All avalible http methods are listed in ActionType class
 * @param route When request comes to this route this action will be executed
 * @param options Extra action options to be applied
 */
export function Method(method: string, route?: RegExp, options?: ActionOptions): Function;
export function Method(method: string, route?: string, options?: ActionOptions): Function;
export function Method(method: string, route?: string|RegExp, options?: ActionOptions): Function {
    return function (object: Object, methodName: string) {
        defaultMetadataStorage.addActionMetadata({
            route: route,
            object: object,
            method: methodName,
            type: method,
            options: options
        });
    }
}
