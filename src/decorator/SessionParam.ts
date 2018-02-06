import {ParamOptions} from "../decorator-options/ParamOptions";
import {getMetadataArgsStorage} from "../index";

/**
 * Injects a Session parameter to the controller action parameter.
 * Can be used in controller actions or in request maps.
 */
export function SessionParam(paramName?: string, options?: ParamOptions): ParameterDecorator {
    return function (object: Object, methodName: string, index: number) {
        getMetadataArgsStorage().params.push({
            type: "session",
            object: object,
            method: methodName,
            index: index,
            name: paramName,
            parse: false, // it makes no sense for Session object to be parsed as json
            required: options && options.required !== undefined ? options.required : true,
            classTransform: options && options.transform !== undefined ? options.transform : undefined,
            validate: options && options.validate !== undefined ? options.validate : false,
        });
    };
}