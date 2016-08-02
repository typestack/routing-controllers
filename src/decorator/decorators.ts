import {defaultMetadataArgsStorage} from "../index";
import {ResponseHandlerTypes} from "../metadata/types/ResponsePropertyTypes";
import {ResponseHandlerMetadataArgs} from "../metadata/args/ResponseHandleMetadataArgs";
import {MiddlewareMetadataArgs} from "../metadata/args/MiddlewareMetadataArgs";
import {UseMetadataArgs} from "../metadata/args/UseMetadataArgs";
import {GlobalMiddlewareOptions} from "./options/GlobalMiddlewareOptions";
import {ClassTransformOptions} from "class-transformer";
import {UseInterceptorMetadataArgs} from "../metadata/args/UseInterceptorMetadataArgs";
import {InterceptorMetadataArgs} from "../metadata/args/InterceptorMetadataArgs";

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
 * Registers a new interceptor.
 */
export function Interceptor(): Function {
    return function (target: Function) {
        const metadata: InterceptorMetadataArgs = {
            target: target,
            isGlobal: false,
            priority: undefined
        };
        defaultMetadataArgsStorage().interceptors.push(metadata);
    };
}

/**
 * Registers a global middleware that runs before the route actions.
 */
export function MiddlewareGlobalBefore(options?: GlobalMiddlewareOptions): Function {
    return function (target: Function) {
        const metadata: MiddlewareMetadataArgs = {
            target: target,
            isGlobal: true,
            priority: options && options.priority ? options.priority : undefined,
            afterAction: false
        };
        defaultMetadataArgsStorage().middlewares.push(metadata);
    };
}

/**
 * Registers a global middleware that runs after the route actions.
 */
export function MiddlewareGlobalAfter(options?: GlobalMiddlewareOptions): Function {
    return function (target: Function) {
        const metadata: MiddlewareMetadataArgs = {
            target: target,
            isGlobal: true,
            priority: options && options.priority ? options.priority : undefined,
            afterAction: true
        };
        defaultMetadataArgsStorage().middlewares.push(metadata);
    };
}

/**
 * Registers a global interceptor.
 */
export function InterceptorGlobal(options?: { priority?: number }): Function {
    return function (target: Function) {
        const metadata: InterceptorMetadataArgs = {
            target: target,
            isGlobal: true,
            priority: options && options.priority ? options.priority : undefined
        };
        defaultMetadataArgsStorage().interceptors.push(metadata);
    };
}

/**
 * Specifies a given middleware to be used for controller or controller action BEFORE the action executes.
 * Must be set to controller action or controller class.
 */
export function UseBefore(...middlewares: Array<Function>): Function;
export function UseBefore(...middlewares: Array<(context: any, next: () => Promise<any>) => Promise<any>>): Function;
export function UseBefore(...middlewares: Array<(request: any, response: any, next: Function) => any>): Function;
export function UseBefore(...middlewares: Array<Function|((request: any, response: any, next: Function) => any)>): Function {
    return function (objectOrFunction: Object|Function, methodName?: string) {
        middlewares.forEach(middleware => {
            const metadata: UseMetadataArgs = {
                middleware: middleware,
                target: methodName ? objectOrFunction.constructor : objectOrFunction as Function,
                method: methodName,
                afterAction: false
            };
            defaultMetadataArgsStorage().uses.push(metadata);
        });
    };
}

/**
 * Specifies a given middleware to be used for controller or controller action AFTER the action executes.
 * Must be set to controller action or controller class.
 */
export function UseAfter(...middlewares: Array<Function>): Function;
export function UseAfter(...middlewares: Array<(context: any, next: () => Promise<any>) => Promise<any>>): Function;
export function UseAfter(...middlewares: Array<(request: any, response: any, next: Function) => any>): Function;
export function UseAfter(...middlewares: Array<Function|((request: any, response: any, next: Function) => any)>): Function {
    return function (objectOrFunction: Object|Function, methodName?: string) {
        middlewares.forEach(middleware => {
            const metadata: UseMetadataArgs = {
                middleware: middleware,
                target: methodName ? objectOrFunction.constructor : objectOrFunction as Function,
                method: methodName,
                afterAction: true
            };
            defaultMetadataArgsStorage().uses.push(metadata);
        });
    };
}

/**
 * Specifies a given interceptor middleware or interceptor function to be used for controller or controller action.
 * Must be set to controller action or controller class.
 */
export function UseInterceptor(...interceptors: Array<Function>): Function;
export function UseInterceptor(...interceptors: Array<(request: any, response: any, result: any) => any>): Function;
export function UseInterceptor(...interceptors: Array<Function|((request: any, response: any, result: any) => any)>): Function {
    return function (objectOrFunction: Object|Function, methodName?: string) {
        interceptors.forEach(interceptor => {
            const metadata: UseInterceptorMetadataArgs = {
                interceptor: interceptor,
                target: methodName ? objectOrFunction.constructor : objectOrFunction as Function,
                method: methodName
            };
            defaultMetadataArgsStorage().useInterceptors.push(metadata);
        });
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
            target: object.constructor,
            method: methodName,
            type: ResponseHandlerTypes.UNDEFINED_RESULT_CODE
        };
        defaultMetadataArgsStorage().responseHandlers.push(metadata);
    };
}

/**
 * Options to be set to class-transformer for the result of the response.
 */
export function ResponseClassTransformOptions(options: ClassTransformOptions) {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandlerMetadataArgs = {
            value: options,
            target: object.constructor,
            method: methodName,
            type: ResponseHandlerTypes.RESPONSE_CLASS_TRANSFORM_OPTIONS
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
            target: object.constructor,
            method: methodName,
            type: ResponseHandlerTypes.RENDERED_TEMPLATE
        };
        defaultMetadataArgsStorage().responseHandlers.push(metadata);
    };
}

/**
 * Forces controller action to return a text response.
 * For example, if @JsonController is used then this decorator ignores it and returns a regular text/html response
 * instead of json.
 */
export function TextResponse() {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandlerMetadataArgs = {
            target: object.constructor,
            method: methodName,
            type: ResponseHandlerTypes.TEXT_RESPONSE
        };
        defaultMetadataArgsStorage().responseHandlers.push(metadata);
    };
}


/**
 * Forces controller action to return a text response.
 * For example, if @Controller is used then this decorator ignores it and returns a json response
 * instead of regular text/html response.
 */
export function JsonResponse() {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandlerMetadataArgs = {
            target: object.constructor,
            method: methodName,
            type: ResponseHandlerTypes.JSON_RESPONSE
        };
        defaultMetadataArgsStorage().responseHandlers.push(metadata);
    };
}
