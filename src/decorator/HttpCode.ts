import {defaultMetadataArgsStorage} from "../index";
import {ResponseHandlerMetadataArgs} from "../metadata/args/ResponseHandleMetadataArgs";

/**
 * Annotation must be set to controller action and given to it code will be used as HTTP Status Code in the case
 * if response result is success.
 */
export function HttpCode(code: number) {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandlerMetadataArgs = {
            value: code,
            target: object.constructor,
            method: methodName,
            type: "success-code"
        };
        defaultMetadataArgsStorage().responseHandlers.push(metadata);
    };
}
