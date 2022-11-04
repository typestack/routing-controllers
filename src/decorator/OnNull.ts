import { getMetadataArgsStorage } from '../index';
import { DecoratorFunction, Newable } from '@rce/types/Types';

/**
 * Used to set specific HTTP status code when result returned by a controller action is equal to null.
 * Must be applied on a controller action.
 */
export function OnNull(code: number): DecoratorFunction;

/**
 * Used to set specific HTTP status code when result returned by a controller action is equal to null.
 * Must be applied on a controller action.
 */
export function OnNull(error: Newable): DecoratorFunction;

/**
 * Used to set specific HTTP status code when result returned by a controller action is equal to null.
 * Must be applied on a controller action.
 */
export function OnNull(codeOrError: number | Newable): DecoratorFunction {
  return function (object: any, methodName: string) {
    getMetadataArgsStorage().responseHandlers.push({
      type: 'on-null',
      target: object.constructor,
      method: methodName,
      value: codeOrError,
    });
  };
}
