import {defaultMetadataArgsStorage} from "../index";
import {ResponseHandlerMetadataArgs} from "../metadata/args/ResponseHandleMetadataArgs";

/**
 * Used to set specific HTTP status code when result returned by a controller action is equal to undefined.
 * Must be applied on a controller action.
 */
export function OnUndefined(code: number): Function {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandlerMetadataArgs = {
            value: code,
            target: object.constructor,
            method: methodName,
            type: "on-undefined"
        };
        defaultMetadataArgsStorage().responseHandlers.push(metadata);
    };
}
