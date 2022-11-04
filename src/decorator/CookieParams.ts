import { getMetadataArgsStorage } from '../index';
import { Newable, Callable } from '@rce/types/Types';

/**
 * Injects all request's cookies to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function CookieParams(): Callable {
  return function (object: Newable, methodName: string, index: number) {
    getMetadataArgsStorage().params.push({
      type: 'cookies',
      object: object,
      method: methodName,
      index: index,
      parse: false,
      required: false,
    });
  };
}
