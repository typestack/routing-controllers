import {defaultMetadataArgsStorage} from "../metadata-builder/MetadataArgsStorage";

/**
 * Injects all request's route parameters to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function Params(): Function {
    return function (object: Object, methodName: string, index: number) {
        defaultMetadataArgsStorage.params.push({
            type: "param",
            object: object,
            method: methodName,
            index: index,
            parse: false, // it does not make sense for Param to be parsed
            required: false,
            classTransform: undefined
        });
    };
}