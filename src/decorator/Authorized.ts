import {getMetadataArgsStorage} from "../index";

/**
 * Marks controller action to have a special access.
 * It usually means it requires user authorization or some specific user role.
 * Authorization logic must be defined in framework settings.
 */
export function Authorized(...roles: any[]): Function {
    return function (clsOrObject: Function|Object, method?: string) {
        getMetadataArgsStorage().responseHandlers.push({
            type: "authorized",
            target: method ? clsOrObject.constructor : clsOrObject as Function,
            method: method,
            value: roles,
        });
    };
}