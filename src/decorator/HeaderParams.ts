import {getMetadataArgsStorage} from "../index";

/**
 * Injects all request's http headers to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function HeaderParams(): Function {
    return function(object: Record<string, any>, methodName: string, index: number): void {
        getMetadataArgsStorage().params.push({
            type: "headers",
            object: object,
            method: methodName,
            index: index,
            parse: false,
            required: false
        });
    };
}
