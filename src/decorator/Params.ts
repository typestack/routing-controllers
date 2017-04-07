import {defaultMetadataArgsStorage} from "../index";
import {ParamMetadataArgs} from "../metadata/args/ParamMetadataArgs";

/**
 * Injects all request's route parameters to the controller action parameter.
 * Must be applied on a controller action parameters.
 */
export function Params(): Function {
    return function (object: Object, methodName: string, index: number) {
        const format = (Reflect as any).getMetadata("design:paramtypes", object, methodName)[index];
        const metadata: ParamMetadataArgs = {
            target: object.constructor,
            method: methodName,
            index: index,
            type: "param",
            reflectedType: format,
            format: format,
            parse: false, // it does not make sense for Param to be parsed
            required: false,
            classTransformOptions: undefined
        };
        defaultMetadataArgsStorage().params.push(metadata);
    };
}