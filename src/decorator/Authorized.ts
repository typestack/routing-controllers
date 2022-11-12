import { getMetadataArgsStorage } from '../index';
import { Callable } from '../types/Types';

type AuthorizedFunction = (clsOrObject: any, method?: string) => void;

/**
 * Marks controller action to have a special access.
 * Authorization logic must be defined in routing-controllers settings.
 */
export function Authorized(): AuthorizedFunction;

/**
 * Marks controller action to have a special access.
 * Authorization logic must be defined in routing-controllers settings.
 */
export function Authorized(role: any): AuthorizedFunction;

/**
 * Marks controller action to have a special access.
 * Authorization logic must be defined in routing-controllers settings.
 */
export function Authorized(roles: any[]): AuthorizedFunction;

/**
 * Marks controller action to have a special access.
 * Authorization logic must be defined in routing-controllers settings.
 */
export function Authorized(role: Callable): AuthorizedFunction;

/**
 * Marks controller action to have a special access.
 * Authorization logic must be defined in routing-controllers settings.
 */
export function Authorized(roleOrRoles?: string | string[] | any): AuthorizedFunction {
  return function (clsOrObject: any, method?: string) {
    getMetadataArgsStorage().responseHandlers.push({
      type: 'authorized',
      target: method ? clsOrObject.constructor : (clsOrObject as Callable),
      method: method,
      value: roleOrRoles,
    });
  };
}
