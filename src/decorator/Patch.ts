import {defaultMetadataArgsStorage} from "../index";
import {ActionMetadataArgs} from "../metadata/args/ActionMetadataArgs";

/**
 * Registers an action to be executed when PATCH request comes on a given route.
 * Must be applied on a controller action.
 */
export function Patch(route?: RegExp): Function;

/**
 * Registers an action to be executed when PATCH request comes on a given route.
 * Must be applied on a controller action.
 */
export function Patch(route?: string): Function;

/**
 * Registers an action to be executed when PATCH request comes on a given route.
 * Must be applied on a controller action.
 */
export function Patch(route?: string|RegExp): Function {
    return function (object: Object, methodName: string) {
        const metadata: ActionMetadataArgs = {
            route: route,
            target: object.constructor,
            method: methodName,
            type: "patch"
        };
        defaultMetadataArgsStorage().actions.push(metadata);
    };
}