import {defaultMetadataArgsStorage} from "../index";
import {ParamMetadataArgs} from "../metadata/args/ParamMetadataArgs";

/**
 * Injects all request's cookies to the controller action parameter.
 * Must be applied on a controller action parameters.
 */
export function CookieParams() {
    return function (object: Object, methodName: string, index: number) {
        const format = (Reflect as any).getMetadata("design:paramtypes", object, methodName)[index];
        const metadata: ParamMetadataArgs = {
            target: object.constructor,
            method: methodName,
            index: index,
            type: "cookie",
            reflectedType: format,
            format: format,
            parseJson: false,
            isRequired: false,
        };
        defaultMetadataArgsStorage().params.push(metadata);
    };
}