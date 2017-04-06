import {defaultMetadataArgsStorage} from "../index";
import {ParamMetadataArgs} from "../metadata/args/ParamMetadataArgs";

/**
 * Injects all uploaded files to the controller action parameter.
 * Must be applied on a controller action parameters.
 */
export function UploadedFiles(name: string, options?: { uploadOptions?: any, required?: boolean }): Function {
    return function (object: Object, methodName: string, index: number) {
        const format = (Reflect as any).getMetadata("design:paramtypes", object, methodName)[index];
        const metadata: ParamMetadataArgs = {
            target: object.constructor,
            method: methodName,
            index: index,
            type: "files",
            reflectedType: format,
            name: name,
            format: format,
            parseJson: false,
            isRequired: options ? options.required : false,
            extraOptions: options ? options.uploadOptions : undefined
        };
        defaultMetadataArgsStorage().params.push(metadata);
    };
}