import {defaultMetadataArgsStorage} from "../metadata-builder/MetadataArgsStorage";

/**
 * Used to set specific HTTP status code when result returned by a controller action is equal to null.
 * Must be applied on a controller action.
 */
export function OnNull(code: number): Function;

/**
 * Used to set specific HTTP status code when result returned by a controller action is equal to null.
 * Must be applied on a controller action.
 */
export function OnNull(error: Function): Function;

/**
 * Used to set specific HTTP status code when result returned by a controller action is equal to null.
 * Must be applied on a controller action.
 */
export function OnNull(codeOrError: number|Function): Function {
    return function (object: Object, methodName: string) {
        defaultMetadataArgsStorage.responseHandlers.push({
            type: "on-null",
            target: object.constructor,
            method: methodName,
            value: codeOrError
        });
    };
}
