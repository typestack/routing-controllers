import {defaultMetadataArgsStorage} from "../index";
import {ActionMetadataArgs} from "../metadata/args/ActionMetadataArgs";

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
        const metadata: ActionMetadataArgs = {
            route: route,
            target: object.constructor,
            method: methodName,
            type: "head"
        };
        defaultMetadataArgsStorage().actions.push(metadata);
    };
}