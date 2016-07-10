import {defaultMetadataArgsStorage} from "../index";
import {MiddlewareOptions} from "./options/MiddlewareOptions";
import {ResponseHandlerTypes} from "../metadata/types/ResponsePropertyTypes";
import {ResponseHandlerMetadataArgs} from "../metadata/args/ResponseHandleMetadataArgs";
import {MiddlewareMetadataArgs} from "../metadata/args/MiddlewareMetadataArgs";
import {ErrorHandlerOptions} from "./options/ErrorHandlerOptions";
import {ErrorHandlerMetadataArgs} from "../metadata/args/ErrorHandlerMetadataArgs";
import {UseMetadataArgs} from "../metadata/args/UseMetadataArgs";
import {GlobalMiddlewareOptions} from "./options/GlobalMiddlewareOptions";

/**
 * Registers a new middleware.
 */
export function Middleware(): Function {
    return function (target: Function) {
        const metadata: MiddlewareMetadataArgs = {
            target: target,
            isGlobal: false,
            priority: undefined,
            afterAction: false
        };
        defaultMetadataArgsStorage().middlewares.push(metadata);
    };
}

/**
 * Registers a global middleware.
 */
export function GlobalMiddleware(options?: GlobalMiddlewareOptions): Function {
    return function (target: Function) {
        const metadata: MiddlewareMetadataArgs = {
            target: target,
            isGlobal: true,
            priority: options && options.priority ? options.priority : undefined,
            afterAction: options && options.afterAction ? options.afterAction : false
        };
        defaultMetadataArgsStorage().middlewares.push(metadata);
    };
}

/**
 * Specifies a given middleware to be used for controller or controller action BEFORE the action executes.
 * Must be set to controller action or controller class.
 */
export function UseBefore(middleware: Function): Function {
    return function (objectOrFunction: Object|Function, methodName?: string) {
        const metadata: UseMetadataArgs = {
            middleware: middleware,
            target: methodName ? objectOrFunction.constructor : objectOrFunction as Function,
            method: methodName,
            afterAction: false
        };
        defaultMetadataArgsStorage().uses.push(metadata);
    };
}

/**
 * Specifies a given middleware to be used for controller or controller action AFTER the action executes.
 * Must be set to controller action or controller class.
 */
export function UseAfter(middleware: Function): Function {
    return function (objectOrFunction: Object|Function, methodName?: string) {
        const metadata: UseMetadataArgs = {
            middleware: middleware,
            target: methodName ? objectOrFunction.constructor : objectOrFunction as Function,
            method: methodName,
            afterAction: true
        };
        defaultMetadataArgsStorage().uses.push(metadata);
    };
}

/**
 * Registers a new error handler middleware.
 */
export function ErrorHandler(options?: ErrorHandlerOptions): Function;
export function ErrorHandler(name?: string, options?: ErrorHandlerOptions): Function;
export function ErrorHandler(nameOrOptions?: string|ErrorHandlerOptions, maybeOptions?: ErrorHandlerOptions): Function {
    const name = typeof nameOrOptions === "string" ? nameOrOptions : undefined;
    const options = nameOrOptions instanceof Object ? <ErrorHandlerOptions> nameOrOptions : maybeOptions;
    
    return function (target: Function) {
        const metadata: ErrorHandlerMetadataArgs = {
            target: target,
            name: name,
            priority: options && options.priority ? options.priority : undefined,
            routes: options && options.routes ? options.routes : undefined
        };
        defaultMetadataArgsStorage().errorHandlers.push(metadata);
    };
}

/**
 * Annotation must be set to controller action and given to it code will be used as HTTP Status Code in the case
 * if response result is success.
 */
export function HttpCode(code: number) {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandlerMetadataArgs = {
            value: code,
            object: object,
            target: object.constructor,
            method: methodName,
            type: ResponseHandlerTypes.SUCCESS_CODE
        };
        defaultMetadataArgsStorage().responseHandlers.push(metadata);
    };
}

/**
 * This decorator is used when user wants to get some specific HTTP code on empty result returned by a controller.
 */
export function EmptyResultCode(code: number) {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandlerMetadataArgs = {
            value: code,
            object: object,
            target: object.constructor,
            method: methodName,
            type: ResponseHandlerTypes.EMPTY_RESULT_CODE
        };
        defaultMetadataArgsStorage().responseHandlers.push(metadata);
    };
}

/**
 * This decorator is used when user wants to get some specific HTTP code on null result returned by a controller.
 */
export function NullResultCode(code: number) {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandlerMetadataArgs = {
            value: code,
            object: object,
            target: object.constructor,
            method: methodName,
            type: ResponseHandlerTypes.NULL_RESULT_CODE
        };
        defaultMetadataArgsStorage().responseHandlers.push(metadata);
    };
}

/**
 * This decorator is used when user wants to get some specific HTTP code on undefined result returned by a controller.
 */
export function UndefinedResultCode(code: number) {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandlerMetadataArgs = {
            value: code,
            object: object,
            target: object.constructor,
            method: methodName,
            type: ResponseHandlerTypes.UNDEFINED_RESULT_CODE
        };
        defaultMetadataArgsStorage().responseHandlers.push(metadata);
    };
}

/**
 * Annotation must be set to controller action and given content-type will be set to response.
 */
export function ContentType(type: string) {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandlerMetadataArgs = {
            value: type,
            object: object,
            target: object.constructor,
            method: methodName,
            type: ResponseHandlerTypes.CONTENT_TYPE
        };
        defaultMetadataArgsStorage().responseHandlers.push(metadata);
    };
}

/**
 * Annotation must be set to controller action and given content-type will be set to response.
 */
export function Header(name: string, value: string) {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandlerMetadataArgs = {
            value: name,
            secondaryValue: value,
            object: object,
            target: object.constructor,
            method: methodName,
            type: ResponseHandlerTypes.HEADER
        };
        defaultMetadataArgsStorage().responseHandlers.push(metadata);
    };
}

/**
 * Sets Location header with given value to the response.
 */
export function Location(url: string) {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandlerMetadataArgs = {
            value: url,
            object: object,
            target: object.constructor,
            method: methodName,
            type: ResponseHandlerTypes.LOCATION
        };
        defaultMetadataArgsStorage().responseHandlers.push(metadata);
    };
}

/**
 * Sets Redirect header with given value to the response.
 */
export function Redirect(url: string) {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandlerMetadataArgs = {
            value: url,
            object: object,
            target: object.constructor,
            method: methodName,
            type: ResponseHandlerTypes.REDIRECT
        };
        defaultMetadataArgsStorage().responseHandlers.push(metadata);
    };
}

/**
 * Specifies a template to be rendered by controller.
 */
export function Render(template: string) {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandlerMetadataArgs = {
            value: template,
            object: object,
            target: object.constructor,
            method: methodName,
            type: ResponseHandlerTypes.RENDERED_TEMPLATE
        };
        defaultMetadataArgsStorage().responseHandlers.push(metadata);
    };
}