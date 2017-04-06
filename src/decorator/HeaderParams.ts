import {defaultMetadataArgsStorage} from "../index";
import {ParamOptions} from "../decorator-options/ParamOptions";
import {ParamMetadataArgs} from "../metadata/args/ParamMetadataArgs";

/**
 * Injects all request's http headers to the controller action parameter.
 * Must be applied on a controller action parameters.
 */
export function HeaderParams(options?: ParamOptions): Function {
    return function (object: Object, methodName: string, index: number) {
        const format = (Reflect as any).getMetadata("design:paramtypes", object, methodName)[index];
        const metadata: ParamMetadataArgs = {
            target: object.constructor,
            method: methodName,
            index: index,
            type: "header",
            reflectedType: format,
            format: format,
            parseJson: options ? options.parse : false,
            isRequired: options ? options.required : false,
            classTransformOptions: options ? options.transform : undefined,
            validate: options && options.validate ? true : false,
            validationOptions: options && options.validate instanceof Object ? options.validate : undefined
        };
        defaultMetadataArgsStorage().params.push(metadata);
    };
}