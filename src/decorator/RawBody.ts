import { BodyOptions } from '../decorator-options/BodyOptions';
import { getMetadataArgsStorage } from '../index';

/**
 * Allows to inject the raw request body value to the controller action parameter,
 * before routing-controllers parses or transforms it.
 * Must be applied on a controller action parameter.
 */
export function RawBody(options?: BodyOptions): Function {
  return function (object: Object, methodName: string, index: number) {
    getMetadataArgsStorage().params.push({
      type: 'raw-body',
      object: object,
      method: methodName,
      index: index,
      parse: false,
      required: options ? options.required || false : false,
      extraOptions: options ? options.options : undefined,
    });
  };
}
