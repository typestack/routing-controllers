import {defaultMetadataArgsStorage} from "../index";
import {ParamMetadataArgs} from "../metadata/args/ParamMetadataArgs";

/**
 * This decorator allows to inject a route parameter value to the controller action parameter.
 * Applied to class method parameters.
 *
 * @param name Parameter name
 */
export function Param(name: string) {
    return function (object: Object, methodName: string, index: number) {
        let format = (Reflect as any).getMetadata("design:paramtypes", object, methodName)[index];
        const metadata: ParamMetadataArgs = {
            target: object.constructor,
            method: methodName,
            index: index,
            type: "param",
            reflectedType: format,
            name: name,
            format: format,
            parseJson: false, // it does not make sense for Param to be parsed
            isRequired: true, // params are always required, because if they are missing router will not match the route
            classTransformOptions: undefined
        };
        defaultMetadataArgsStorage().params.push(metadata);
    };
}