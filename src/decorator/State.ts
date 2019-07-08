import {getMetadataArgsStorage} from '../index';

/**
 * Injects a State object to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function State(objectName?: string): Function {
    return function(object: Object, methodName: string, index: number) {
        getMetadataArgsStorage().params.push({
            type: 'state',
            object,
            method: methodName,
            index,
            name: objectName,
            parse: false, // it does not make sense for Session to be parsed
            required: true, // when we demand session object, it must exist (working session middleware)
            classTransform: undefined,
        });
    };
}
