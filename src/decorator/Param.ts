import {defaultMetadataArgsStorage} from "../index";
import {ParamMetadataArgs} from "../metadata/args/ParamMetadataArgs";

/**
 * Injects a request's route parameter value to the controller action parameter.
 * Must be applied on a controller action parameters.
 */
export function Param(name: string): Function {
    return function (object: Object, methodName: string, index: number) {
        const format = (Reflect as any).getMetadata("design:paramtypes", object, methodName)[index];
        const metadata: ParamMetadataArgs = {
            target: object.constructor,
            method: methodName,
            index: index,
            type: "param",
            reflectedType: format,
            name: name,
            format: format,
            parse: false, // it does not make sense for Param to be parsed
            required: true, // params are always required, because if they are missing router will not match the route
            classTransformOptions: undefined
        };
        defaultMetadataArgsStorage().params.push(metadata);
    };
}