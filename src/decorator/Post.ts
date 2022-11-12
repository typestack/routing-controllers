import { HandlerOptions } from '../decorator-options/HandlerOptions';
import { getMetadataArgsStorage } from '../index';
import { DecoratorFunction } from '../types/Types';

/**
 * Registers an action to be executed when POST request comes on a given route.
 * Must be applied on a controller action.
 */
export function Post(route?: RegExp, options?: HandlerOptions): DecoratorFunction;

/**
 * Registers an action to be executed when POST request comes on a given route.
 * Must be applied on a controller action.
 */
export function Post(route?: string, options?: HandlerOptions): DecoratorFunction;

/**
 * Registers an action to be executed when POST request comes on a given route.
 * Must be applied on a controller action.
 */
export function Post(route?: string | RegExp, options?: HandlerOptions): DecoratorFunction {
  return function (object: any, methodName: string) {
    getMetadataArgsStorage().actions.push({
      type: 'post',
      target: object.constructor,
      method: methodName,
      options,
      route,
    });
  };
}
