import {defaultMetadataArgsStorage} from "../index";
import {ResponseHandlerTypes} from "../metadata/types/ResponsePropertyTypes";
import {ResponseHandlerMetadataArgs} from "../metadata/args/ResponseHandleMetadataArgs";
import {ClassTransformOptions} from "class-transformer";

/**
 * Options to be set to class-transformer for the result of the response.
 */
export function ResponseClassTransformOptions(options: ClassTransformOptions) {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandlerMetadataArgs = {
            value: options,
            target: object.constructor,
            method: methodName,
            type: ResponseHandlerTypes.RESPONSE_CLASS_TRANSFORM_OPTIONS
        };
        defaultMetadataArgsStorage().responseHandlers.push(metadata);
    };
}
