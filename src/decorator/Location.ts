import {defaultMetadataArgsStorage} from "../index";
import {ResponseHandlerMetadataArgs} from "../metadata/args/ResponseHandleMetadataArgs";

/**
 * Sets Location header with given value to the response.
 */
export function Location(url: string) {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandlerMetadataArgs = {
            value: url,
            target: object.constructor,
            method: methodName,
            type: "location"
        };
        defaultMetadataArgsStorage().responseHandlers.push(metadata);
    };
}