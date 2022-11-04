import { HandlerOptions } from '../decorator-options/HandlerOptions';
import { getMetadataArgsStorage } from '../index';
import { DecoratorFunction } from '@rce/types/Types';

/**
 * Registers an action to be executed when GET request comes on a given route.
 * Must be applied on a controller action.
 */
export function Get(route?: RegExp, options?: HandlerOptions): DecoratorFunction;

/**
 * Registers an action to be executed when GET request comes on a given route.
 * Must be applied on a controller action.
 */
export function Get(route?: string, options?: HandlerOptions): DecoratorFunction;

/**
 * Registers an action to be executed when GET request comes on a given route.
 * Must be applied on a controller action.
 */
export function Get(route?: string | RegExp, options?: HandlerOptions): DecoratorFunction {
  return function (object: any, methodName: string) {
    getMetadataArgsStorage().actions.push({
      type: 'get',
      target: object.constructor,
      method: methodName,
      options,
      route,
    });
  };
}
