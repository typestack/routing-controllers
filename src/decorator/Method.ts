import {defaultMetadataArgsStorage} from "../index";
import {ActionType} from "../metadata/types/ActionTypes";
import {ActionMetadataArgs} from "../metadata/args/ActionMetadataArgs";

/**
 * Registers an action to be executed when request with specified method comes on a given route.
 * Applied to controller class methods.
 *
 * @param method Http method to be registered. All avalible http methods are listed in ActionType class
 * @param route When request comes to this route this action will be executed
 */
export function Method(method: ActionType, route?: RegExp): Function;
export function Method(method: ActionType, route?: string): Function;
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
