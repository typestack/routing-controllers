import {defaultMetadataArgsStorage} from "../index";
import {ResponseHandlerMetadataArgs} from "../metadata/args/ResponseHandleMetadataArgs";

/**
 * Used to set specific HTTP status code when result returned by a controller action is equal to null.
 * Must be applied on a controller action.
 */
export function OnNull(code: number): Function {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandlerMetadataArgs = {
            value: code,
            target: object.constructor,
            method: methodName,
            type: "on-null"
        };
        defaultMetadataArgsStorage().responseHandlers.push(metadata);
    };
}
