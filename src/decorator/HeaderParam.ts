import {defaultMetadataArgsStorage} from "../index";
import {ParamOptions} from "../metadata-options/ParamOptions";
import {ParamMetadataArgs} from "../metadata/args/ParamMetadataArgs";

/**
 * This decorator allows to inject http header parameter value to the controller action parameter.
 * Applied to class method parameters.
 *
 * @param name Parameter name
 * @param options Extra parameter options
 */
export function HeaderParam(name: string, options?: ParamOptions) {
    return function (object: Object, methodName: string, index: number) {
        const format = (Reflect as any).getMetadata("design:paramtypes", object, methodName)[index];
        const metadata: ParamMetadataArgs = {
            target: object.constructor,
            method: methodName,
            index: index,
            type: "header",
            reflectedType: format,
            name: name,
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