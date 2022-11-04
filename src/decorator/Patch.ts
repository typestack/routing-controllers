import { HandlerOptions } from '../decorator-options/HandlerOptions';
import { getMetadataArgsStorage } from '../index';
import { DecoratorFunction } from '@rce/types/Types';

/**
 * Registers an action to be executed when PATCH request comes on a given route.
 * Must be applied on a controller action.
 */
export function Patch(route?: RegExp, options?: HandlerOptions): DecoratorFunction;

/**
 * Registers an action to be executed when PATCH request comes on a given route.
 * Must be applied on a controller action.
 */
export function Patch(route?: string, options?: HandlerOptions): DecoratorFunction;

/**
 * Registers an action to be executed when PATCH request comes on a given route.
 * Must be applied on a controller action.
 */
export function Patch(route?: string | RegExp, options?: HandlerOptions): DecoratorFunction {
  return function (object: any, methodName: string) {
    getMetadataArgsStorage().actions.push({
      type: 'patch',
      target: object.constructor,
      method: methodName,
      route: route,
      options,
    });
  };
}
