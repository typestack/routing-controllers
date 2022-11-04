import { ParamOptions } from '../decorator-options/ParamOptions';
import { getMetadataArgsStorage } from '../index';
import { Newable, Callable } from '@rce/types/Types';

/**
 * Injects a request's http header value to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function HeaderParam(name: string, options?: ParamOptions): Callable {
  return function (object: Newable, methodName: string, index: number) {
    getMetadataArgsStorage().params.push({
      type: 'header',
      object: object,
      method: methodName,
      index: index,
      name: name,
      parse: options ? options.parse : false,
      required: options ? options.required : undefined,
      classTransform: options ? options.transform : undefined,
      explicitType: options ? options.type : undefined,
      validate: options ? options.validate : undefined,
    });
  };
}
