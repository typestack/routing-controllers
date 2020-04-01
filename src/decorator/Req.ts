import {getMetadataArgsStorage} from "../index";

/**
 * Injects a Request object to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function Req(): Function {
    return function(object: Record<string, any>, methodName: string, index: number): void {
        getMetadataArgsStorage().params.push({
            type: "request",
            object: object,
            method: methodName,
            index: index,
            parse: false,
            required: false
        });
    };
}
