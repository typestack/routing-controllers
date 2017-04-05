import {defaultMetadataArgsStorage} from "../index";
import {ActionTypes} from "../metadata/types/ActionTypes";
import {ActionMetadataArgs} from "../metadata/args/ActionMetadataArgs";

/**
 * Registers an action to be executed when PATCH request comes on a given route.
 * Applied to controller class methods.
 *
 * @param route When request comes to this route this action will be executed
 */
export function Patch(route?: RegExp): Function;
export function Patch(route?: string): Function;
export function Patch(route?: string|RegExp): Function {
    return function (object: Object, methodName: string) {
        const metadata: ActionMetadataArgs = {
            route: route,
            target: object.constructor,
            method: methodName,
            type: ActionTypes.PATCH
        };
        defaultMetadataArgsStorage().actions.push(metadata);
    };
}