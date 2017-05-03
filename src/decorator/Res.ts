import {getMetadataArgsStorage} from "../index";

/**
 * Injects a Response object to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function Res(): Function {
    return function (object: Object, methodName: string, index: number) {
        getMetadataArgsStorage().params.push({
            type: "response",
            object: object,
            method: methodName,
            index: index,
            parse: false,
            required: false
        });
    };
}
