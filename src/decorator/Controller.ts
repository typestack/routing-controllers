import { getMetadataArgsStorage } from '../index';
import { ControllerOptions } from '../decorator-options/ControllerOptions';
import { Newable, Callable } from '@rce/types/Types';

/**
 * Defines a class as a controller.
 * Each decorated controller method is served as a controller action.
 * Controller actions are executed when request come.
 *
 * @param baseRoute Extra path you can apply as a base route to all controller actions
 * @param options Extra options that apply to all controller actions
 */
export function Controller(baseRoute?: string, options?: ControllerOptions): Callable {
  return function (object: Newable) {
    getMetadataArgsStorage().controllers.push({
      type: 'default',
      target: object,
      route: baseRoute,
      options,
    });
  };
}
