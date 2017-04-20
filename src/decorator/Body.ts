import {defaultMetadataArgsStorage} from "../index";
import {ParamMetadataArgs} from "../metadata/args/ParamMetadataArgs";
import {BodyOptions} from "../decorator-options/BodyOptions";

/**
 * Allows to inject a request body value to the controller action parameter.
 * Must be applied on a controller action parameters.
 */
export function Body(options?: BodyOptions): Function {
    return function (object: Object, methodName: string, index: number) {
        const format = (Reflect as any).getMetadata("design:paramtypes", object, methodName)[index];
        const metadata: ParamMetadataArgs = {
            target: object.constructor,
            method: methodName,
            index: index,
            type: "body",
            targetType: format,
            parse: false,
            required: options ? options.required : false,
            classTransform: options ? options.transform : undefined,
            validate: options ? options.validate : undefined,
        };
        defaultMetadataArgsStorage().params.push(metadata);
    };
}