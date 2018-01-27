import {getMetadataArgsStorage} from "../index";

/**
 * Redirects or renders
 */
export function RedirectOrRender(template: string): Function {
    return function (object: Object, methodName: string) {
        getMetadataArgsStorage().responseHandlers.push({
            type: "render-or-redirect",
            target: object.constructor,
            method: methodName,
            value: template
        });
    };
}
