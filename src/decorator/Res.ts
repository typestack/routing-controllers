import { getMetadataArgsStorage } from '../index';
import { Callable } from '../types/Types';

/**
 * Injects a Response object to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function Res(): Callable {
  return function (object: Callable, methodName: string, index: number) {
    getMetadataArgsStorage().params.push({
      type: 'response',
      object: object,
      method: methodName,
      index: index,
      parse: false,
      required: false,
    });
  };
}
