import { ParamOptions } from '../decorator-options/ParamOptions';
import { getMetadataArgsStorage } from '../index';
import { Newable, Callable } from '../types/Types';

/**
 * Injects a request's cookie value to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function CookieParam(name: string, options?: ParamOptions): Callable {
  return function (object: Newable, methodName: string, index: number) {
    getMetadataArgsStorage().params.push({
      type: 'cookie',
      object: object,
      method: methodName,
      index: index,
      name: name,
      parse: options ? options.parse : false,
      required: options ? options.required : undefined,
      explicitType: options ? options.type : undefined,
      classTransform: options ? options.transform : undefined,
      validate: options ? options.validate : undefined,
    });
  };
}
