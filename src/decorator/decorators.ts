import "reflect-metadata";
import {defaultMetadataStorage} from "./../metadata/MetadataStorage";
import {ActionType} from "./../metadata/ActionMetadata";
import {ResponsePropertyType} from "./../metadata/ResponsePropertyMetadata";
import {ControllerType} from "./../metadata/ControllerMetadata";
import {ParamType, ParamOptions} from "./../metadata/ParamMetadata";
import {ActionOptions} from "./../metadata/ActionMetadata";

/**
 * Defines a class which will intercept all response to be sent to the client. Using such classes gives ability to
 * change content of the response (both success and error) on-the-fly. Classes that uses this decorator must
 * implement ResponseInterceptorInterface.
 * 
 * @param priority Special priority to be used to define order of interceptors to be executed
 */
export function ResponseInterceptor(priority: number = 0) {
    return function (object: Function) {
        defaultMetadataStorage.addResponseInterceptorMetadata({
            object: object,
            priority: priority
        });
    };
}

/**
 * Annotation must be set to controller action and given to it code will be used as HTTP Status Code in the case
 * if response result is success.
 */
export function HttpCode(code: number) {
    return function (object: Object, methodName: string) {
        defaultMetadataStorage.addResponsePropertyMetadata({
            value: code,
            object: object,
            method: methodName,
            type: ResponsePropertyType.SUCCESS_CODE
        });
    };
}

/**
 * Annotation must be set to controller action and given content-type will be set to response.
 */
export function ContentType(type: string) {
    return function (object: Object, methodName: string) {
        defaultMetadataStorage.addResponsePropertyMetadata({
            value: type,
            object: object,
            method: methodName,
            type: ResponsePropertyType.SUCCESS_CODE
        });
    };
}

/**
 * Annotation must be set to controller action and given content-type will be set to response.
 */
export function Header(name: string, value: string) {
    return function (object: Object, methodName: string) {
        defaultMetadataStorage.addResponsePropertyMetadata({
            value: name,
            value2: value,
            object: object,
            method: methodName,
            type: ResponsePropertyType.HEADER
        });
    };
}

/**
 * Sets Location header with given value to the response.
 */
export function Location(value: string) {
    return function (object: Object, methodName: string) {
        defaultMetadataStorage.addResponsePropertyMetadata({
            value: value,
            object: object,
            method: methodName,
            type: ResponsePropertyType.LOCATION
        });
    };
}

/**
 * Sets Redirect header with given value to the response.
 */
export function Redirect(value: string) {
    return function (object: Object, methodName: string) {
        defaultMetadataStorage.addResponsePropertyMetadata({
            value: value,
            object: object,
            method: methodName,
            type: ResponsePropertyType.REDIRECT
        });
    };
}

/**
 * Specifies a template to be rendered by controller.
 */
export function Render(template: string) {
    return function (object: Object, methodName: string) {
        defaultMetadataStorage.addResponsePropertyMetadata({
            value: template,
            object: object,
            method: methodName,
            type: ResponsePropertyType.RENDERED_TEMPLATE
        });
    };
}
