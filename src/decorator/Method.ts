import {defaultMetadataArgsStorage} from "../index";
import {ActionType} from "../metadata/types/ActionTypes";
import {ActionMetadataArgs} from "../metadata/args/ActionMetadataArgs";

/**
 * Registers an action to be executed when request with specified method comes on a given route.
 * Must be applied on a controller action.
 */
export function Method(method: ActionType, route?: RegExp): Function;

/**
 * Registers an action to be executed when request with specified method comes on a given route.
 * Must be applied on a controller action.
 */
export function Method(method: ActionType, route?: string): Function;

/**
 * Registers an action to be executed when request with specified method comes on a given route.
 * Must be applied on a controller action.
 */
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
