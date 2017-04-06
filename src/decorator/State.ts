import {defaultMetadataArgsStorage} from "../index";
import {ParamMetadataArgs} from "../metadata/args/ParamMetadataArgs";

/**
 * This decorator allows to inject a State object to the controller action parameter.
 * Applied to class method parameters.
 *
 * @param objectName The name of object stored in State
 */
export function State(objectName?: string) {
    return function (object: Object, methodName: string, index: number) {
        let format = (Reflect as any).getMetadata("design:paramtypes", object, methodName)[index];
        const metadata: ParamMetadataArgs = {
            target: object.constructor,
            method: methodName,
            index: index,
            type: "state",
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