import { getMetadataArgsStorage } from '../index';
import { Newable, Callable } from '@rce/types/Types';

/**
 * Sets response header.
 * Must be applied on a controller action.
 */
export function Header(name: string, value: string): Callable {
  return function (object: Newable, methodName: string) {
    getMetadataArgsStorage().responseHandlers.push({
      type: 'header',
      target: object.constructor,
      method: methodName,
      value: name,
      secondaryValue: value,
    });
  };
}
