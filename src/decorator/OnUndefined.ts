import {getMetadataArgsStorage} from "../index";

/**
 * Used to set specific HTTP status code when result returned by a controller action is equal to undefined.
 * Must be applied on a controller action.
 */
export function OnUndefined(code: number): Function;

/**
 * Used to set specific HTTP status code when result returned by a controller action is equal to undefined.
 * Must be applied on a controller action.
 */
export function OnUndefined(error: Function): Function;

/**
 * Used to set specific HTTP status code when result returned by a controller action is equal to undefined.
 * Must be applied on a controller action.
 */
export function OnUndefined(codeOrError: number|Function): Function {
    return function(object: Record<string, any>, methodName: string): void {
        getMetadataArgsStorage().responseHandlers.push({
            type: "on-undefined",
            target: object.constructor,
            method: methodName,
            value: codeOrError
        });
    };
}
