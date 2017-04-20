import {defaultMetadataArgsStorage} from "../index";
import {ParamMetadataArgs} from "../metadata/args/ParamMetadataArgs";
import {UploadOptions} from "../decorator-options/UploadOptions";

/**
 * Injects all uploaded files to the controller action parameter.
 * Must be applied on a controller action parameters.
 */
export function UploadedFiles(name: string, options?: UploadOptions): Function {
    return function (object: Object, methodName: string, index: number) {
        const format = (Reflect as any).getMetadata("design:paramtypes", object, methodName)[index];
        const metadata: ParamMetadataArgs = {
            target: object.constructor,
            method: methodName,
            index: index,
            type: "files",
            name: name,
            targetType: format,
            parse: false,
            required: options ? options.required : false,
            extraOptions: options ? options.options : undefined
        };
        defaultMetadataArgsStorage().params.push(metadata);
    };
}