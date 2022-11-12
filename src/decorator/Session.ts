import { ParamOptions } from '../decorator-options/ParamOptions';
import { getMetadataArgsStorage } from '../index';
import { Callable } from '../types/Types';

/**
 * Injects a Session object to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function Session(options?: ParamOptions): Callable {
  return function (object: Callable, methodName: string, index: number) {
    getMetadataArgsStorage().params.push({
      type: 'session',
      object: object,
      method: methodName,
      index: index,
      parse: false, // it makes no sense for Session object to be parsed as json
      required: options && options.required !== undefined ? options.required : true,
      classTransform: options && options.transform,
      validate: options && options.validate !== undefined ? options.validate : false,
    });
  };
}
