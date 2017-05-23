import {getMetadataArgsStorage} from "../index";
import {ParamOptions} from "../decorator-options/ParamOptions";

/**
 * Takes partial data of the request body.
 * Must be applied on a controller action parameter.
 */
export function BodyParam(name: string, options?: ParamOptions): Function {
    return function (object: Object, methodName: string, index: number) {
        getMetadataArgsStorage().params.push({
            type: "body-param",
            object: object,
            method: methodName,
            index: index,
            name: name,
            parse: options ? options.parse : false,
            required: options ? options.required : false,
            explicitType: options ? options.type : undefined,
            classTransform: options ? options.transform : undefined,
            validate: options ? options.validate : undefined
        });
    };
}