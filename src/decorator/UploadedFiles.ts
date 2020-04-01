import {UploadOptions} from "../decorator-options/UploadOptions";
import {getMetadataArgsStorage} from "../index";

/**
 * Injects all uploaded files to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function UploadedFiles(name: string, options?: UploadOptions): Function {
    return function(object: Record<string, any>, methodName: string, index: number): void {
        getMetadataArgsStorage().params.push({
            type: "files",
            object: object,
            method: methodName,
            index: index,
            name: name,
            parse: false,
            required: options ? options.required : undefined,
            extraOptions: options ? options.options : undefined
        });
    };
}
