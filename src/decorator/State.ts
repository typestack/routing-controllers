import {getMetadataArgsStorage} from "../index";

/**
 * Injects a State object to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
// TODO: Is there a test for this?
export function State(objectName?: string): Function {
    return function(object: Record<string, any>, methodName: string, index: number): void {
        getMetadataArgsStorage().params.push({
            type: "state",
            object: object,
            method: methodName,
            index: index,
            name: objectName,
            parse: false, // it does not make sense for Session to be parsed
            required: true, // when we demand session object, it must exist (working session middleware)
            classTransform: undefined
        });
    };
}
