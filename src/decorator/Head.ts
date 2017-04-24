import {defaultMetadataArgsStorage} from "../metadata-builder/MetadataArgsStorage";

/**
 * Registers an action to be executed when HEAD request comes on a given route.
 * Must be applied on a controller action.
 */
export function Head(route?: RegExp): Function;

/**
 * Registers an action to be executed when HEAD request comes on a given route.
 * Must be applied on a controller action.
 */
export function Head(route?: string): Function;

/**
 * Registers an action to be executed when HEAD request comes on a given route.
 * Must be applied on a controller action.
 */
export function Head(route?: string|RegExp): Function {
    return function (object: Object, methodName: string) {
        defaultMetadataArgsStorage.actions.push({
            type: "head",
            target: object.constructor,
            method: methodName,
            route: route
        });
    };
}