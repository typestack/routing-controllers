import {defaultMetadataArgsStorage} from "../index";
import {ResponseHandlerMetadataArgs} from "../metadata/args/ResponseHandleMetadataArgs";

/**
 * Annotation must be set to controller action and given content-type will be set to response.
 */
export function ContentType(type: string) {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandlerMetadataArgs = {
            value: type,
            target: object.constructor,
            method: methodName,
            type: "content-type"
        };
        defaultMetadataArgsStorage().responseHandlers.push(metadata);
    };
}