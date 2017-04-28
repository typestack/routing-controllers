import {BodyOptions} from "../decorator-options/BodyOptions";
import {getMetadataArgsStorage} from "../index";

/**
 * Allows to inject a request body value to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function Body(options?: BodyOptions): Function {
    return function (object: Object, methodName: string, index: number) {
        getMetadataArgsStorage().params.push({
            type: "body",
            object: object,
            method: methodName,
            index: index,
            parse: false,
            required: options ? options.required : false,
            classTransform: options ? options.transform : undefined,
            validate: options ? options.validate : undefined,
            extraOptions: options ? options.options : undefined
        });
    };
}