import {defaultMetadataArgsStorage} from "../index";
import {ResponseHandlerTypes} from "../metadata/types/ResponsePropertyTypes";
import {ResponseHandlerMetadataArgs} from "../metadata/args/ResponseHandleMetadataArgs";

/**
 * Forces controller action to return a text response.
 * For example, if @Controller is used then this decorator ignores it and returns a json response
 * instead of regular text/html response.
 *
 * @deprecated use @ContentType("application/json") instead
 */
export function JsonResponse() {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandlerMetadataArgs = {
            target: object.constructor,
            method: methodName,
            type: ResponseHandlerTypes.JSON_RESPONSE
        };
        defaultMetadataArgsStorage().responseHandlers.push(metadata);
    };
}
