import { getMetadataArgsStorage } from '../index';
import { Callable } from '@rce/types/Types';

/**
 * Injects a Request object to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function Req(): Callable {
  return function (object: Callable, methodName: string, index: number) {
    getMetadataArgsStorage().params.push({
      type: 'request',
      object: object,
      method: methodName,
      index: index,
      parse: false,
      required: false,
    });
  };
}
