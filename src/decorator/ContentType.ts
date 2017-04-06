import {defaultMetadataArgsStorage} from "../index";
import {ResponseHandlerMetadataArgs} from "../metadata/args/ResponseHandleMetadataArgs";

/**
 * Sets response Content-Type.
 * Must be applied on a controller action.
 */
export function ContentType(contentType: string): Function {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandlerMetadataArgs = {
            value: contentType,
            target: object.constructor,
            method: methodName,
            type: "content-type"
        };
        defaultMetadataArgsStorage().responseHandlers.push(metadata);
    };
}