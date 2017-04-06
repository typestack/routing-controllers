import {defaultMetadataArgsStorage} from "../index";
import {ResponseHandlerMetadataArgs} from "../metadata/args/ResponseHandleMetadataArgs";

/**
 * This decorator is used when user wants to get some specific HTTP code on undefined result returned by a controller.
 *
 * @deprecated use @OnUndefined(code) decorator instead
 */
export function UndefinedResultCode(code: number) {
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
