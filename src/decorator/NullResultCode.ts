import {defaultMetadataArgsStorage} from "../index";
import {ResponseHandlerTypes} from "../metadata/types/ResponsePropertyTypes";
import {ResponseHandlerMetadataArgs} from "../metadata/args/ResponseHandleMetadataArgs";

/**
 * This decorator is used when user wants to get some specific HTTP code on null result returned by a controller.
 *
 * @deprecated use @OnNull(code) decorator instead
 */
export function NullResultCode(code: number) {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandlerMetadataArgs = {
            value: code,
            target: object.constructor,
            method: methodName,
            type: ResponseHandlerTypes.NULL_RESULT_CODE
        };
        defaultMetadataArgsStorage().responseHandlers.push(metadata);
    };
}
