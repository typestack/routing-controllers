import {getMetadataArgsStorage} from "../index";

/**
 * Indicates that this action is the last in the route/middleware chain if it matches.
 * Prevents any further routes or middleware from running after this action is executed.
 */
export function Terminates(): Function {
    return function (object: Object, methodName: string) {
        getMetadataArgsStorage().responseHandlers.push({
            type: "terminates",
            target: object.constructor,
            method: methodName
        });
    };
}
