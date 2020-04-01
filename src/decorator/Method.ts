import {getMetadataArgsStorage} from "../index";
import {ActionType} from "../metadata/types/ActionType";

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
    return function(object: Record<string, any>, methodName: string): void {
        getMetadataArgsStorage().actions.push({
            type: method,
            target: object.constructor,
            method: methodName,
            route: route
        });
    };
}
