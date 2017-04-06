import {defaultMetadataArgsStorage} from "../index";
import {ParamMetadataArgs} from "../metadata/args/ParamMetadataArgs";
import {BodyParamOptions} from "../metadata-options/BodyParamOptions";

/**
 * This decorator allows to inject a request body's value to the controller action parameter.
 * Applied to class method parameters.
 *
 * @param name Body's parameter name
 * @param options Extra parameter options
 */
export function BodyParam(name: string, options?: BodyParamOptions) {
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
            parseJson: options ? options.parse : false,
            isRequired: options ? options.required : false,
            classTransformOptions: options ? options.transform : undefined,
            validate: options && options.validate ? true : false,
            validationOptions: options && options.validate instanceof Object ? options.validate : undefined
        };
        defaultMetadataArgsStorage().params.push(metadata);
    };
}