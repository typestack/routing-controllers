import {BodyOptions} from "../decorator-options/BodyOptions";
import {getMetadataArgsStorage} from "../index";

/**
 * Injects a value from the request body.
 * Can be used in controller actions or in request maps.
 */
export function Body(options?: BodyOptions): Function {
    return function (object: Object, methodName: string, index: number) {
        getMetadataArgsStorage().params.push({
            type: "body",
            object: object,
            method: methodName,
            index: index,
            parse: false,
            required: options ? options.required : undefined,
            classTransform: options ? options.transform : undefined,
            validate: options ? options.validate : undefined,
            explicitType: options ? options.type : undefined,
            extraOptions: options ? options.options : undefined
        });
    };
}