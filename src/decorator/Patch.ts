import {getMetadataArgsStorage} from '../index';

/**
 * Registers an action to be executed when PATCH request comes on a given route.
 * Must be applied on a controller action.
 */
export function Patch(route?: RegExp): Function;

/**
 * Registers an action to be executed when PATCH request comes on a given route.
 * Must be applied on a controller action.
 */
export function Patch(route?: string): Function;

/**
 * Registers an action to be executed when PATCH request comes on a given route.
 * Must be applied on a controller action.
 */
export function Patch(route?: string | RegExp): Function {
  return (object: Object, methodName: string) => {
    getMetadataArgsStorage().actions.push({
      type: 'patch',
      target: object.constructor,
      method: methodName,
      route,
    });
  };
}
