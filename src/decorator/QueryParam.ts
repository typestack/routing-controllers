import {ParamOptions} from "../decorator-options/ParamOptions";
import {getMetadataArgsStorage} from "../index";

/**
 * Injects a request's query parameter value to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function QueryParam(name: string, options?: ParamOptions): Function {
    return function (object: Object, methodName: string, index: number) {
        getMetadataArgsStorage().params.push({
            type: "query",
            object: object,
            method: methodName,
            index: index,
            name: name,
            parse: options ? options.parse : false,
            required: options ? options.required : undefined,
            classTransform: options ? options.transform : undefined,
            explicitType: options ? options.type : undefined,
            validate: options ? options.validate : undefined
        });
    };
}