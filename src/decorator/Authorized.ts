import {getMetadataArgsStorage} from "../index";

/**
 * Marks controller action to have a special access.
 * Authorization logic must be defined in routing-controllers settings.
 */
export function Authorized(): Function;

/**
 * Marks controller action to have a special access.
 * Authorization logic must be defined in routing-controllers settings.
 */
export function Authorized(role: string): Function;

/**
 * Marks controller action to have a special access.
 * Authorization logic must be defined in routing-controllers settings.
 */
export function Authorized(roles: string[]): Function;

/**
 * Marks controller action to have a special access.
 * Authorization logic must be defined in routing-controllers settings.
 */
export function Authorized(role: Function): Function;

/**
 * Marks controller action to have a special access.
 * Authorization logic must be defined in routing-controllers settings.
 */
export function Authorized(roleOrRoles?: string|string[]|Function): Function {
    return function (clsOrObject: Function|Object, method?: string) {
        getMetadataArgsStorage().responseHandlers.push({
            type: "authorized",
            target: method ? clsOrObject.constructor : clsOrObject as Function,
            method: method,
            value: roleOrRoles
        });
    };
}