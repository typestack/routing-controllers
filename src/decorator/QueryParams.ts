import { ParamOptions } from '../decorator-options/ParamOptions';
import { getMetadataArgsStorage } from '../index';
import { Callable } from '@rce/types/Types';

/**
 * Injects all request's query parameters to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function QueryParams(options?: ParamOptions): Callable {
  return function (object: Callable, methodName: string, index: number) {
    getMetadataArgsStorage().params.push({
      type: 'queries',
      object: object,
      method: methodName,
      index: index,
      name: '',
      parse: options ? options.parse : false,
      required: options ? options.required : undefined,
      classTransform: options ? options.transform : undefined,
      explicitType: options ? options.type : undefined,
      validate: options ? options.validate : undefined,
    });
  };
}
