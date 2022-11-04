import { getMetadataArgsStorage } from '../index';
import { Callable } from '@rce/types/Types';

/**
 * Specifies a template to be rendered by a controller action.
 * Must be applied on a controller action.
 */
export function Render(template: string): Callable {
  return function (object: Callable, methodName: string) {
    getMetadataArgsStorage().responseHandlers.push({
      type: 'rendered-template',
      target: object.constructor,
      method: methodName,
      value: template,
    });
  };
}
