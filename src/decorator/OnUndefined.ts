import { getMetadataArgsStorage } from '../index';
import { DecoratorFunction, Newable } from '@rce/types/Types';

/**
 * Used to set specific HTTP status code when result returned by a controller action is equal to undefined.
 * Must be applied on a controller action.
 */
export function OnUndefined(code: number): DecoratorFunction;

/**
 * Used to set specific HTTP status code when result returned by a controller action is equal to undefined.
 * Must be applied on a controller action.
 */
export function OnUndefined(error: Newable): DecoratorFunction;

/**
 * Used to set specific HTTP status code when result returned by a controller action is equal to undefined.
 * Must be applied on a controller action.
 */
export function OnUndefined(codeOrError: number | Newable): DecoratorFunction {
  return function (object: any, methodName: string) {
    getMetadataArgsStorage().responseHandlers.push({
      type: 'on-undefined',
      target: object.constructor,
      method: methodName,
      value: codeOrError,
    });
  };
}
