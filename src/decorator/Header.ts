import {defaultMetadataArgsStorage} from "../index";
import {ResponseHandlerMetadataArgs} from "../metadata/args/ResponseHandleMetadataArgs";

/**
 * Sets response header.
 * Must be applied on a controller action.
 */
export function Header(name: string, value: string): Function {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandlerMetadataArgs = {
            value: name,
            secondaryValue: value,
            target: object.constructor,
            method: methodName,
            type: "header"
        };
        defaultMetadataArgsStorage().responseHandlers.push(metadata);
    };
}