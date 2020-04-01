import {getMetadataArgsStorage} from "../index";

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
    return function (object: Record<string, any>, methodName: string): void {
        getMetadataArgsStorage().actions.push({
            type: "delete",
            target: object.constructor,
            method: methodName,
            route: route
        });
    };
}
