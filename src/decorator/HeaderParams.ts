import { getMetadataArgsStorage } from '../index';
import { Newable, Callable } from '@rce/types/Types';

/**
 * Injects all request's http headers to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function HeaderParams(): Callable {
  return function (object: Newable, methodName: string, index: number) {
    getMetadataArgsStorage().params.push({
      type: 'headers',
      object: object,
      method: methodName,
      index: index,
      parse: false,
      required: false,
    });
  };
}
