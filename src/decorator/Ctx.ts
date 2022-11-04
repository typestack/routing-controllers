import { getMetadataArgsStorage } from '../index';
import { Newable, Callable } from '@rce/types/Types';

/**
 * Injects a Koa's Context object to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function Ctx(): Callable {
  return function (object: Newable, methodName: string, index: number) {
    getMetadataArgsStorage().params.push({
      type: 'context',
      object: object,
      method: methodName,
      index: index,
      parse: false,
      required: false,
    });
  };
}
