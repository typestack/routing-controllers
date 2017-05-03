import {getMetadataArgsStorage} from "../index";

/**
 * Injects all request's query parameters to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function QueryParams(): Function {
    return function (object: Object, methodName: string, index: number) {
        getMetadataArgsStorage().params.push({
            type: "queries",
            object: object,
            method: methodName,
            index: index,
            parse: false,
            required: false
        });
    };
}