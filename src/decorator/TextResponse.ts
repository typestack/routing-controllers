import {defaultMetadataArgsStorage} from "../index";
import {ResponseHandlerTypes} from "../metadata/types/ResponsePropertyTypes";
import {ResponseHandlerMetadataArgs} from "../metadata/args/ResponseHandleMetadataArgs";

/**
 * Forces controller action to return a text response.
 * For example, if @JsonController is used then this decorator ignores it and returns a regular text/html response
 * instead of json.
 *
 * @deprecated use @ContentType("text/html") instead
 */
export function TextResponse() {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandlerMetadataArgs = {
            target: object.constructor,
            method: methodName,
            type: ResponseHandlerTypes.TEXT_RESPONSE
        };
        defaultMetadataArgsStorage().responseHandlers.push(metadata);
    };
}