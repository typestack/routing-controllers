import {defaultMetadataArgsStorage} from "../index";
import {ResponseHandlerMetadataArgs} from "../metadata/args/ResponseHandleMetadataArgs";

/**
 * Specifies a template to be rendered by controller.
 */
export function Render(template: string) {
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