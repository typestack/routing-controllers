import {defaultMetadataArgsStorage} from "../index";
import {ParamMetadataArgs} from "../metadata/args/ParamMetadataArgs";

/**
 * Injects an uploaded file object to the controller action parameter.
 * Must be applied on a controller action parameters.
 */
export function UploadedFile(name: string, options?: { options?: any, required?: boolean }): Function {
    return function (object: Object, methodName: string, index: number) {
        const format = (Reflect as any).getMetadata("design:paramtypes", object, methodName)[index];
        const metadata: ParamMetadataArgs = {
            target: object.constructor,
            method: methodName,
            index: index,
            type: "file",
            reflectedType: format,
            name: name,
            format: format,
            parseJson: false,
            isRequired: options ? options.required : false,
            extraOptions: options ? options.options : undefined
        };
        defaultMetadataArgsStorage().params.push(metadata);
    };
}