import {defaultMetadataArgsStorage} from "../index";
import {ResponseHandlerMetadataArgs} from "../metadata/args/ResponseHandleMetadataArgs";

/**
 * Specifies a template to be rendered by a controller action.
 * Must be applied on a controller action.
 */
export function Render(template: string): Function {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandlerMetadataArgs = {
            value: template,
            target: object.constructor,
            method: methodName,
            type: "rendered-template"
        };
        defaultMetadataArgsStorage().responseHandlers.push(metadata);
    };
}