import {defaultMetadataArgsStorage} from "../index";
import {ActionMetadataArgs} from "../metadata/args/ActionMetadataArgs";

/**
 * Registers an action to be executed when HEAD request comes on a given route.
 * Applied to controller class methods.
 *
 * @param route When request comes to this route this action will be executed
 */
export function Head(route?: RegExp): Function;
export function Head(route?: string): Function;
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