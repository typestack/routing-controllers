import {getMetadataArgsStorage} from "../index";

/**
 * Indicates that this route should fall through to further route handlers or middleware after being executed.
 * This is equivalent to a route handler calling next() with no parameters in Express.
 */
export function Fallthrough(): Function {
    return function (object: Object, methodName: string) {
        getMetadataArgsStorage().responseHandlers.push({
            type: "fallthrough",
            target: object.constructor,
            method: methodName
        });
    };
}
