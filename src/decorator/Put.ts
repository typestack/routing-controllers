import {getMetadataArgsStorage} from '../index';

/**
 * Registers an action to be executed when PUT request comes on a given route.
 * Must be applied on a controller action.
 */
export function Put(route?: RegExp): Function;

/**
 * Registers an action to be executed when POST request comes on a given route.
 * Must be applied on a controller action.
 */
export function Put(route?: string): Function;

/**
 * Registers an action to be executed when POST request comes on a given route.
 * Must be applied on a controller action.
 */
export function Put(route?: string | RegExp): Function {
  return function(object: Object, methodName: string) {
    getMetadataArgsStorage().actions.push({
      type: 'put',
      target: object.constructor,
      method: methodName,
      route,
    });
  };
}
