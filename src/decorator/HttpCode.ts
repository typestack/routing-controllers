import {defaultMetadataArgsStorage} from "../index";
import {ResponseHandlerMetadataArgs} from "../metadata/args/ResponseHandleMetadataArgs";

/**
 * Sets response HTTP status code.
 * Must be applied on a controller action.
 */
export function HttpCode(code: number): Function {
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
