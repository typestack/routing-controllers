import {getMetadataArgsStorage} from "../index";

/**
 * Injects currently authorized user.
 * Authorization logic must be defined in routing-controllers settings.
 */
export function CurrentUser(options?: { required?: boolean }) {
    return function (object: Record<string, any>, methodName: string, index: number): void {
        getMetadataArgsStorage().params.push({
            type: "current-user",
            object: object,
            method: methodName,
            index: index,
            parse: false,
            required: options ? options.required : undefined
        });
    };
}
