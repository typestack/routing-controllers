import {defaultMetadataArgsStorage} from "../index";
import {ParamOptions} from "../metadata-options/ParamOptions";
import {ParamMetadataArgs} from "../metadata/args/ParamMetadataArgs";

/**
 * This decorator allows to inject a request body's value to the controller action parameter.
 * Applied to class method parameters.
 *
 * @param name Body's parameter name
 * @param options Extra parameter options
 */
export function BodyParam(name: string, options?: ParamOptions) {
    return function (object: Object, methodName: string, index: number) {
        let format = (Reflect as any).getMetadata("design:paramtypes", object, methodName)[index];
        const metadata: ParamMetadataArgs = {
            target: object.constructor,
            method: methodName,
            index: index,
            type: "body-param",
            reflectedType: format,
            name: name,
            format: format,
            parseJson: options ? options.parseJson : false,
            isRequired: options ? options.required : false,
            classTransformOptions: options ? options.classTransformOptions : undefined,
            validate: options ? options.validate : undefined,
            validationOptions: options ? options.validationOptions : undefined
        };
        defaultMetadataArgsStorage().params.push(metadata);
    };
}