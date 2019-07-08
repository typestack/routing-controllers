import {getMetadataArgsStorage} from '../index';

/**
 * Sets response header.
 * Must be applied on a controller action.
 */
export function Header(name: string, value: string): Function {
  return (object: Object, methodName: string) => {
    getMetadataArgsStorage().responseHandlers.push({
      type: 'header',
      target: object.constructor,
      method: methodName,
      value: name,
      secondaryValue: value,
    });
  };
}
