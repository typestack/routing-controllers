import { getMetadataArgsStorage } from '../index';
import { ClassTransformOptions } from 'class-transformer';
import { Newable, Callable } from '@rce/types/Types';

/**
 * Options to be set to class-transformer for the result of the response.
 */
export function ResponseClassTransformOptions(options: ClassTransformOptions): Callable {
  return function (object: Newable | Callable, methodName: string) {
    getMetadataArgsStorage().responseHandlers.push({
      type: 'response-class-transform-options',
      value: options,
      target: object.constructor,
      method: methodName,
    });
  };
}
