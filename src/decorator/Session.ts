import {defaultMetadataArgsStorage} from "../index";
import {ParamMetadataArgs} from "../metadata/args/ParamMetadataArgs";

/**
 * Injects a Session object to the controller action parameter.
 * Must be applied on a controller action parameters.
 */
export function Session(objectName?: string): Function {
    return function (object: Object, methodName: string, index: number) {
        const format = (Reflect as any).getMetadata("design:paramtypes", object, methodName)[index];
        const metadata: ParamMetadataArgs = {
            target: object.constructor,
            method: methodName,
            index: index,
            type: "session",
            reflectedType: format,
            name: objectName,
            format: format,
            parseJson: false, // it does not make sense for Session to be parsed
            isRequired: true, // when we demand session object, it must exist (working session middleware)
            classTransformOptions: undefined
        };
        defaultMetadataArgsStorage().params.push(metadata);
    };
}