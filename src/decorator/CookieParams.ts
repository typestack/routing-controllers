import {getMetadataArgsStorage} from '../index';

/**
 * Injects all request's cookies to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function CookieParams() {
  return (object: Object, methodName: string, index: number) => {
    getMetadataArgsStorage().params.push({
      type: 'cookies',
      object,
      method: methodName,
      index,
      parse: false,
      required: false,
    });
  };
}
