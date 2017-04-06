import {defaultMetadataArgsStorage} from "../index";
import {ResponseHandlerMetadataArgs} from "../metadata/args/ResponseHandleMetadataArgs";

/**
 * Annotation must be set to controller action and given content-type will be set to response.
 */
export function Header(name: string, value: string) {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandlerMetadataArgs = {
            value: name,
            secondaryValue: value,
            target: object.constructor,
            method: methodName,
            type: "header"
        };
        defaultMetadataArgsStorage().responseHandlers.push(metadata);
    };
}