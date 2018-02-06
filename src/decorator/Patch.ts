import {getMetadataArgsStorage} from "../index";

/**
 * Registers an action to be executed when PATCH request comes on a given route.
 * Must be applied on a controller action.
 */
export function Patch(route?: string|RegExp): Function {
    return function (object: Object, methodName: string) {
        getMetadataArgsStorage().actions.push({
            type: "patch",
            target: object.constructor,
            method: methodName,
            route: route
        });
    };
}