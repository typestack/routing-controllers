import { getMetadataArgsStorage } from '../index';
import { Newable, Callable } from '../types/Types';

/**
 * Sets Location header with given value to the response.
 * Must be applied on a controller action.
 */
export function Location(url: string): Callable {
  return function (object: Newable, methodName: string) {
    getMetadataArgsStorage().responseHandlers.push({
      type: 'location',
      target: object.constructor,
      method: methodName,
      value: url,
    });
  };
}
