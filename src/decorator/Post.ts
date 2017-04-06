import {defaultMetadataArgsStorage} from "../index";
import {ActionMetadataArgs} from "../metadata/args/ActionMetadataArgs";

/**
 * Registers an action to be executed when POST request comes on a given route.
 * Must be applied on a controller action.
 */
export function Post(route?: RegExp): Function;

/**
 * Registers an action to be executed when POST request comes on a given route.
 * Must be applied on a controller action.
 */
export function Post(route?: string): Function;

/**
 * Registers an action to be executed when POST request comes on a given route.
 * Must be applied on a controller action.
 */
export function Post(route?: string|RegExp): Function {
    return function (object: Object, methodName: string) {
        const metadata: ActionMetadataArgs = {
            route: route,
            target: object.constructor,
            method: methodName,
            type: "post"
        };
        defaultMetadataArgsStorage().actions.push(metadata);
    };
}
