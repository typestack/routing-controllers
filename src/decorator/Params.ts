import {ParamOptions} from '../decorator-options/ParamOptions';
import {getMetadataArgsStorage} from '../index';

/**
 * Injects all request's route parameters to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function Params(options?: ParamOptions): Function {
  return function(object: Object, methodName: string, index: number) {
    getMetadataArgsStorage().params.push({
      type: 'params',
      object,
      method: methodName,
      index,
      parse: options ? options.parse : false,
      required: options ? options.required : undefined,
      classTransform: options ? options.transform : undefined,
      explicitType: options ? options.type : undefined,
      validate: options ? options.validate : undefined,
    });
  };
}
