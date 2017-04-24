import {defaultMetadataArgsStorage} from "../metadata-builder/MetadataArgsStorage";
import {ClassTransformOptions} from "class-transformer";

/**
 * Options to be set to class-transformer for the result of the response.
 */
export function ResponseClassTransformOptions(options: ClassTransformOptions): Function {
    return function (object: Object, methodName: string) {
        defaultMetadataArgsStorage.responseHandlers.push({
            type: "response-class-transform-options",
            value: options,
            target: object.constructor,
            method: methodName
        });
    };
}
