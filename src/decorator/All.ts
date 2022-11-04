import { getMetadataArgsStorage } from '../index';
import { ControllerOptions } from '../decorator-options/ControllerOptions';
import { Newable } from '@rce/types/Types';

type AllFunction = (object: Newable, methodName: string) => void;

/**
 * Registers an action to be executed when a request comes on a given route.
 * Must be applied on a controller action.
 */
export function All(route?: RegExp): AllFunction;

/**
 * Registers an action to be executed when a request comes on a given route.
 * Must be applied on a controller action.
 */
export function All(route?: string): AllFunction;

/**
 * Registers an action to be executed when a request comes on a given route.
 * Must be applied on a controller action.
 */
export function All(route?: string | RegExp, options?: ControllerOptions): AllFunction {
  return function (object: Newable, methodName: string) {
    getMetadataArgsStorage().actions.push({
      type: 'all',
      target: object.constructor,
      method: methodName,
      route: route,
      options,
    });
  };
}
