import {getMetadataArgsStorage} from "../index";

/**
 * Sets response header.
 * Must be applied on a controller action.
 */
export function Header(name: string, value: string): Function {
    return function (object: Record<string, any>, methodName: string): void {
        getMetadataArgsStorage().responseHandlers.push({
            type: "header",
            target: object.constructor,
            method: methodName,
            value: name,
            secondaryValue: value
        });
    };
}
