import {getMetadataArgsStorage} from "../index";

/**
 * Registers an action to be executed when HEAD request comes on a given route.
 * Must be applied on a controller action.
 */
export function Head(route?: string|RegExp): Function {
    return function (object: Object, methodName: string) {
        getMetadataArgsStorage().actions.push({
            type: "head",
            target: object.constructor,
            method: methodName,
            route: route
        });
    };
}