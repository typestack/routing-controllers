import type { HandlerOptions } from '../decorator-options/HandlerOptions';
import { getMetadataArgsStorage } from '../index';
import type { ActionMetadataArgs } from '../metadata/args/ActionMetadataArgs';

/**
 * Registers an action to be executed when GET request comes on a given route.
 * Must be applied on a controller action.
 */
export function Get(route?: RegExp, options?: HandlerOptions): Function;

/**
 * Registers an action to be executed when GET request comes on a given route.
 * Must be applied on a controller action.
 */
export function Get(route?: string, options?: HandlerOptions): Function;

/**
 * Registers an action to be executed when GET request comes on a given route.
 * Must be applied on a controller action.
 */
export function Get(route?: string | RegExp, options?: HandlerOptions): Function {
  return function (object: Object, methodName: string) {
    getMetadataArgsStorage().actions.push(<ActionMetadataArgs>{
      type: 'get',
      target: object.constructor,
      method: methodName,
      options,
      route,
    });
  };
}
