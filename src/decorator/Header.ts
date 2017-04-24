import {defaultMetadataArgsStorage} from "../metadata-builder/MetadataArgsStorage";

/**
 * Sets response header.
 * Must be applied on a controller action.
 */
export function Header(name: string, value: string): Function {
    return function (object: Object, methodName: string) {
        defaultMetadataArgsStorage.responseHandlers.push({
            type: "header",
            target: object.constructor,
            method: methodName,
            value: name,
            secondaryValue: value
        });
    };
}