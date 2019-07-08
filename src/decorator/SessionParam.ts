import {ParamOptions} from '../decorator-options/ParamOptions';
import {getMetadataArgsStorage} from '../index';

/**
 * Injects a Session object property to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function SessionParam(propertyName: string, options?: ParamOptions): ParameterDecorator {
  return (object: Object, methodName: string, index: number) => {
    getMetadataArgsStorage().params.push({
      type: 'session-param',
      object,
      method: methodName,
      index,
      name: propertyName,
      parse: false, // it makes no sense for Session object to be parsed as json
      required: options && options.required !== undefined ? options.required : false,
      classTransform: options && options.transform,
      validate: options && options.validate !== undefined ? options.validate : false,
    });
  };
}
