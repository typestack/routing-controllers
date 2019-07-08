import {ParamOptions} from '../decorator-options/ParamOptions';
import {getMetadataArgsStorage} from '../index';

/**
 * Injects a request's http header value to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function HeaderParam(name: string, options?: ParamOptions): Function {
    return function(object: Object, methodName: string, index: number) {
        getMetadataArgsStorage().params.push({
            type: 'header',
            object,
            method: methodName,
            index,
            name,
            parse: options ? options.parse : false,
            required: options ? options.required : undefined,
            classTransform: options ? options.transform : undefined,
            explicitType: options ? options.type : undefined,
            validate: options ? options.validate : undefined,
        });
    };
}
