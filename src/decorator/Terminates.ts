import {getMetadataArgsStorage} from "../index";

/**
 * Sets Redirect header with given value to the response.
 * Must be applied on a controller action.
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
