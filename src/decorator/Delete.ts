import {defaultMetadataArgsStorage} from "../metadata-builder/MetadataArgsStorage";

/**
 * Registers a controller method to be executed when DELETE request comes on a given route.
 * Must be applied on a controller action.
 */
export function Delete(route?: RegExp): Function;

/**
 * Registers a controller method to be executed when DELETE request comes on a given route.
 * Must be applied on a controller action.
 */
export function Delete(route?: string): Function;

/**
 * Registers a controller method to be executed when DELETE request comes on a given route.
 * Must be applied on a controller action.
 */
export function Delete(route?: string|RegExp): Function {
    return function (object: Object, methodName: string) {
        defaultMetadataArgsStorage.actions.push({
            type: "delete",
            target: object.constructor,
            method: methodName,
            route: route
        });
    };
}
