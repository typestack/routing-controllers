import { getMetadataArgsStorage } from '../index';

/**
 * Injects a Request object to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function Req(): Function {
  return function (object: Object, methodName: string, index: number) {
    getMetadataArgsStorage().params.push({
      type: 'request',
      object: object,
      method: methodName,
      index: index,
      parse: false,
      required: false,
    });
  };
}
