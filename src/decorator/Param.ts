import {defaultMetadataArgsStorage} from "../metadata-builder/MetadataArgsStorage";

/**
 * Injects a request's route parameter value to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function Param(name: string): Function {
    return function (object: Object, methodName: string, index: number) {
        defaultMetadataArgsStorage.params.push({
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