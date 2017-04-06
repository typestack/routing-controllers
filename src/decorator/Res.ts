import {defaultMetadataArgsStorage} from "../index";
import {ParamMetadataArgs} from "../metadata/args/ParamMetadataArgs";

/**
 * This decorator allows to inject a Response object to the controller action parameter. After that you can fully use
 * Response object in your action method. Applied to class method parameters.
 */
export function Res() {
    return function (object: Object, methodName: string, index: number) {
        const reflectedType = (Reflect as any).getMetadata("design:paramtypes", object, methodName)[index];
        const metadata: ParamMetadataArgs = {
            target: object.constructor,
            method: methodName,
            index: index,
            type: "response",
            reflectedType: reflectedType,
            parseJson: false,
            isRequired: false
        };
        defaultMetadataArgsStorage().params.push(metadata);
    };
}
