import {getMetadataArgsStorage} from "../index";

/**
 * Injects a request's route parameter value to the controller action parameter.
 * Can be used in controller actions or in request maps.
 */
export function Param(name?: string): Function {
    return function (object: Object, methodName: string, index?: number) {
        getMetadataArgsStorage().params.push({
            type: "param",
            object: object,
            method: methodName,
            index: index,
            name: name,
            parse: false, // it does not make sense for Param to be parsed
            required: true, // params are always required, because if they are missing router will not match the route
            classTransform: undefined
        });
    };
}