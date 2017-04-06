import {defaultMetadataArgsStorage} from "../index";
import {ActionMetadataArgs} from "../metadata/args/ActionMetadataArgs";

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
        const metadata: ActionMetadataArgs = {
            route: route,
            target: object.constructor,
            method: methodName,
            type: "delete"
        };
        defaultMetadataArgsStorage().actions.push(metadata);
    };
}
