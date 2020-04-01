import {getMetadataArgsStorage} from "../index";

/**
 * Sets Location header with given value to the response.
 * Must be applied on a controller action.
 */
export function Location(url: string): Function {
    return function(object: Record<string, any>, methodName: string): void {
        getMetadataArgsStorage().responseHandlers.push({
            type: "location",
            target: object.constructor,
            method: methodName,
            value: url
        });
    };
}
