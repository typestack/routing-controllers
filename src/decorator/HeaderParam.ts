import {defaultMetadataArgsStorage} from "../index";
import {ParamOptions} from "../decorator-options/ParamOptions";
import {ParamMetadataArgs} from "../metadata/args/ParamMetadataArgs";

/**
 * Injects a request's http header value to the controller action parameter.
 * Must be applied on a controller action parameters.
 */
export function HeaderParam(name: string, options?: ParamOptions): Function {
    return function (object: Object, methodName: string, index: number) {
        const format = (Reflect as any).getMetadata("design:paramtypes", object, methodName)[index];
        const metadata: ParamMetadataArgs = {
            target: object.constructor,
            method: methodName,
            index: index,
            type: "header",
            name: name,
            targetType: format,
            parse: options ? options.parse : false,
            required: options ? options.required : false,
            classTransform: options ? options.transform : undefined,
            validate: options ? options.validate : undefined,
        };
        defaultMetadataArgsStorage().params.push(metadata);
    };
}