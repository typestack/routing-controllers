import { BodyOptions } from '../decorator-options/BodyOptions';
import { getMetadataArgsStorage } from '../index';
import { Newable } from '../types/Types';

type BodyFunction = (object: Newable, methodName: string, index: number) => void;

/**
 * Allows to inject a request body value to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function Body(options?: BodyOptions): BodyFunction {
  return function (object: Newable, methodName: string, index: number) {
    getMetadataArgsStorage().params.push({
      type: 'body',
      object: object,
      method: methodName,
      index: index,
      parse: false,
      required: options ? options.required : undefined,
      classTransform: options ? options.transform : undefined,
      validate: options ? options.validate : undefined,
      explicitType: options ? options.type : undefined,
      extraOptions: options ? options.options : undefined,
    });
  };
}
