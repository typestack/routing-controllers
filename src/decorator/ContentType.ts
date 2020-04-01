import {getMetadataArgsStorage} from "../index";

/**
 * Sets response Content-Type.
 * Must be applied on a controller action.
 */
export function ContentType(contentType: string): Function {
    return function (object: Record<string, any>, methodName: string): void {
        getMetadataArgsStorage().responseHandlers.push({
            type: "content-type",
            target: object.constructor,
            method: methodName,
            value: contentType
        });
    };
}
