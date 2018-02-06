import {ParamOptions} from "../decorator-options/ParamOptions";
import {getMetadataArgsStorage} from "../index";

/**
 * Takes partial data of the request body.
 * Can be used in controller actions or in request maps.
 */
export function BodyParam(name?: string, options?: ParamOptions): Function {
    return function (object: Object, methodName: string, index?: number) {
        getMetadataArgsStorage().params.push({
            type: "body-param",
            object: object,
            method: methodName,
            index: index,
            name: name,
            parse: options ? options.parse : false,
            required: options ? options.required : undefined,
            explicitType: options ? options.type : undefined,
            classTransform: options ? options.transform : undefined,
            validate: options ? options.validate : undefined
        });
    };
}