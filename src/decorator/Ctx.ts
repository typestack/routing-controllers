import {getMetadataArgsStorage} from '../index';

/**
 * Injects a Koa's Context object to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function Ctx(): Function {
  return function(object: Object, methodName: string, index: number) {
    getMetadataArgsStorage().params.push({
      type: 'context',
      object,
      method: methodName,
      index,
      parse: false,
      required: false,
    });
  };
}
