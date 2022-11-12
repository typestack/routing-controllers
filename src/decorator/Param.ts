import { getMetadataArgsStorage } from '../index';
import { Newable, Callable } from '../types/Types';

/**
 * Injects a request's route parameter value to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function Param(name: string): Callable {
  return function (object: Newable, methodName: string, index: number) {
    getMetadataArgsStorage().params.push({
      type: 'param',
      object: object,
      method: methodName,
      index: index,
      name: name,
      parse: false, // it does not make sense for Param to be parsed
      required: true, // params are always required, because if they are missing router will not match the route
      classTransform: undefined,
    });
  };
}
