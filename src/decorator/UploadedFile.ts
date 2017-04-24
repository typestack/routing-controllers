import {defaultMetadataArgsStorage} from "../metadata-builder/MetadataArgsStorage";
import {UploadOptions} from "../decorator-options/UploadOptions";

/**
 * Injects an uploaded file object to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function UploadedFile(name: string, options?: UploadOptions): Function {
    return function (object: Object, methodName: string, index: number) {
        defaultMetadataArgsStorage.params.push({
            type: "file",
            object: object,
            method: methodName,
            index: index,
            name: name,
            parse: false,
            required: options ? options.required : false,
            extraOptions: options ? options.options : undefined
        });
    };
}