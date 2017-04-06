import {defaultMetadataArgsStorage} from "../index";
import {ResponseHandlerMetadataArgs} from "../metadata/args/ResponseHandleMetadataArgs";

/**
 * This decorator is used when user wants to get some specific HTTP code on null result returned by a controller.
 */
export function OnNull(code: number) {
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
