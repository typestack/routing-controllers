import {defaultMetadataArgsStorage} from "../index";
import {ResponseHandlerTypes} from "../metadata/types/ResponsePropertyTypes";
import {ResponseHandlerMetadataArgs} from "../metadata/args/ResponseHandleMetadataArgs";

/**
 * Sets Redirect header with given value to the response.
 */
export function Redirect(url: string) {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandlerMetadataArgs = {
            value: url,
            target: object.constructor,
            method: methodName,
            type: ResponseHandlerTypes.REDIRECT
        };
        defaultMetadataArgsStorage().responseHandlers.push(metadata);
    };
}
