import { getMetadataArgsStorage } from '../index';
import { Callable } from '@rce/types/Types';

/**
 * Sets Redirect header with given value to the response.
 * Must be applied on a controller action.
 */
export function Redirect(url: string): Callable {
  return function (object: Callable, methodName: string) {
    getMetadataArgsStorage().responseHandlers.push({
      type: 'redirect',
      target: object.constructor,
      method: methodName,
      value: url,
    });
  };
}
