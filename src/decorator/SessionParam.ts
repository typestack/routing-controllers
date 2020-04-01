import { ParamOptions } from "../decorator-options/ParamOptions";
import { getMetadataArgsStorage } from "../index";

/**
 * Injects a Session object property to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function SessionParam(propertyName: string, options?: ParamOptions): ParameterDecorator {
    return function (object: Object, methodName: string | symbol, index: number) {
        getMetadataArgsStorage().params.push({
            type: "session-param",
            object: object,
            method: methodName as string,
            index: index,
            name: propertyName,
            parse: false, // it makes no sense for Session object to be parsed as json
            required: options && options.required !== undefined ? options.required : false,
            classTransform: options && options.transform,
            validate: options && options.validate !== undefined ? options.validate : false,
        });
    };
}
