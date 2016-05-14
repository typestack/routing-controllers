import {defaultMetadataStorage} from "../index";
import {MiddlewareOptions} from "./options/MiddlewareOptions";
import {ResponseHandleTypes} from "../metadata/types/ResponsePropertyTypes";
import {ResponseHandleMetadata} from "../metadata/ResponseHandleMetadata";
import {MiddlewareMetadata} from "../metadata/MiddlewareMetadata";

/**
 * Registers a new middleware.
 */
export function Middleware(name?: string, options?: MiddlewareOptions) {
    return function (target: Function) {
        const metadata: MiddlewareMetadata = {
            target: target,
            name: name,
            priority: options && options.priority ? options.priority : undefined,
            routes: options && options.routes ? options.routes : undefined
        };
        defaultMetadataStorage().middlewareMetadatas.push(metadata);
    };
}

/**
 * Annotation must be set to controller action and given to it code will be used as HTTP Status Code in the case
 * if response result is success.
 */
export function HttpCode(code: number) {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandleMetadata = {
            primaryValue: code,
            object: object,
            method: methodName,
            type: ResponseHandleTypes.SUCCESS_CODE
        };
        defaultMetadataStorage().responseHandleMetadatas.push(metadata);
    };
}

/**
 * This decorator is used when user wants to get some specific HTTP code on empty result returned by a controller.
 */
export function EmptyResultCode(code: number) {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandleMetadata = {
            primaryValue: code,
            object: object,
            method: methodName,
            type: ResponseHandleTypes.EMPTY_RESULT_CODE
        };
        defaultMetadataStorage().responseHandleMetadatas.push(metadata);
    };
}

/**
 * This decorator is used when user wants to get some specific HTTP code on null result returned by a controller.
 */
export function NullResultCode(code: number) {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandleMetadata = {
            primaryValue: code,
            object: object,
            method: methodName,
            type: ResponseHandleTypes.NULL_RESULT_CODE
        };
        defaultMetadataStorage().responseHandleMetadatas.push(metadata);
    };
}

/**
 * This decorator is used when user wants to get some specific HTTP code on undefined result returned by a controller.
 */
export function UndefinedResultCode(code: number) {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandleMetadata = {
            primaryValue: code,
            object: object,
            method: methodName,
            type: ResponseHandleTypes.UNDEFINED_RESULT_CODE
        };
        defaultMetadataStorage().responseHandleMetadatas.push(metadata);
    };
}

/**
 * Annotation must be set to controller action and given content-type will be set to response.
 */
export function ContentType(type: string) {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandleMetadata = {
            primaryValue: type,
            object: object,
            method: methodName,
            type: ResponseHandleTypes.CONTENT_TYPE
        };
        defaultMetadataStorage().responseHandleMetadatas.push(metadata);
    };
}

/**
 * Annotation must be set to controller action and given content-type will be set to response.
 */
export function Header(name: string, value: string) {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandleMetadata = {
            primaryValue: name,
            secondaryValue: value,
            object: object,
            method: methodName,
            type: ResponseHandleTypes.HEADER
        };
        defaultMetadataStorage().responseHandleMetadatas.push(metadata);
    };
}

/**
 * Sets Location header with given value to the response.
 */
export function Location(value: string) {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandleMetadata = {
            primaryValue: value,
            object: object,
            method: methodName,
            type: ResponseHandleTypes.LOCATION
        };
        defaultMetadataStorage().responseHandleMetadatas.push(metadata);
    };
}

/**
 * Sets Redirect header with given value to the response.
 */
export function Redirect(value: string) {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandleMetadata = {
            primaryValue: value,
            object: object,
            method: methodName,
            type: ResponseHandleTypes.REDIRECT
        };
        defaultMetadataStorage().responseHandleMetadatas.push(metadata);
    };
}

/**
 * Specifies a template to be rendered by controller.
 */
export function Render(template: string) {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandleMetadata = {
            primaryValue: template,
            object: object,
            method: methodName,
            type: ResponseHandleTypes.RENDERED_TEMPLATE
        };
        defaultMetadataStorage().responseHandleMetadatas.push(metadata);
    };
}
