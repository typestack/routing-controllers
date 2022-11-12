import { HandlerOptions } from '../decorator-options/HandlerOptions';
import { getMetadataArgsStorage } from '../index';
import { DecoratorFunction } from '../types/Types';

/**
 * Registers an action to be executed when HEAD request comes on a given route.
 * Must be applied on a controller action.
 */
export function Head(route?: RegExp, options?: HandlerOptions): DecoratorFunction;

/**
 * Registers an action to be executed when HEAD request comes on a given route.
 * Must be applied on a controller action.
 */
export function Head(route?: string, options?: HandlerOptions): DecoratorFunction;

/**
 * Registers an action to be executed when HEAD request comes on a given route.
 * Must be applied on a controller action.
 */
export function Head(route?: string | RegExp, options?: HandlerOptions): DecoratorFunction {
  return function (object: any, methodName: string) {
    getMetadataArgsStorage().actions.push({
      type: 'head',
      target: object.constructor,
      method: methodName,
      options,
      route,
    });
  };
}
