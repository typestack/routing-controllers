import { getMetadataArgsStorage } from '../index';
import { Newable, Callable } from '@rce/types/Types';

/**
 * Sets response Content-Type.
 * Must be applied on a controller action.
 */
export function ContentType(contentType: string): Callable {
  return function (object: Newable, methodName: string) {
    getMetadataArgsStorage().responseHandlers.push({
      type: 'content-type',
      target: object.constructor,
      method: methodName,
      value: contentType,
    });
  };
}
