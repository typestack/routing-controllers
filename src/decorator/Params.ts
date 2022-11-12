import { ParamOptions } from '../decorator-options/ParamOptions';
import { getMetadataArgsStorage } from '../index';
import { Newable, Callable } from '../types/Types';

/**
 * Injects all request's route parameters to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function Params(options?: ParamOptions): Callable {
  return function (object: Newable, methodName: string, index: number) {
    getMetadataArgsStorage().params.push({
      type: 'params',
      object: object,
      method: methodName,
      index: index,
      parse: options ? options.parse : false,
      required: options ? options.required : undefined,
      classTransform: options ? options.transform : undefined,
      explicitType: options ? options.type : undefined,
      validate: options ? options.validate : undefined,
    });
  };
}
