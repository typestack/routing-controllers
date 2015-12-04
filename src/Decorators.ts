import "reflect-metadata";
import {defaultMetadataStorage} from "./metadata/MetadataStorage";
import {ActionType} from "./metadata/ActionMetadata";
import {ResponsePropertyType} from "./metadata/ResponsePropertyMetadata";
import {ControllerType} from "./metadata/ControllerMetadata";
import {ParamType, ParamOptions} from "./metadata/ParamMetadata";
import {ActionOptions} from "./metadata/ActionMetadata";

/**
 * Defines a class as a controller. All methods with special decorators will be registered as controller actions.
 * Controller actions are executed when request to their routes comes.
 *
 * @param baseRoute Extra path you can apply as a base route to all controller actions
 */
export function Controller(baseRoute?: string) {
    return function (object: Function) {
        defaultMetadataStorage.addControllerMetadata({
            route: baseRoute,
            object: object,
            type: ControllerType.DEFAULT
        });
    }
}

/**
 * Defines a class as a JSON controller. If JSON controller is used, then all controller actions will return
 * a serialized json data, and its response content-type always will be application/json.
 *
 * @param baseRoute Extra path you can apply as a base route to all controller actions
 */
export function JsonController(baseRoute?: string) {
    return function (object: Function) {
        defaultMetadataStorage.addControllerMetadata({
            route: baseRoute,
            object: object,
            type: ControllerType.JSON
        });
    }
}

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
    }
}

/**
 * Registers an action to be executed when GET request comes on a given route.
 * Applied to controller class methods.
 * 
 * @param route When request comes to this route this action will be executed
 * @param options Extra action options to be applied
 */
export function Get(route?: RegExp, options?: ActionOptions): Function;
export function Get(route?: string, options?: ActionOptions): Function;
export function Get(route?: string|RegExp, options?: ActionOptions): Function {
    return function (object: Object, methodName: string) {
        defaultMetadataStorage.addActionMetadata({
            route: route,
            object: object,
            method: methodName,
            type: ActionType.GET,
            options: options
        });
    }
}

/**
 * Registers an action to be executed when POST request comes on a given route.
 * Applied to controller class methods.
 *
 * @param route When request comes to this route this action will be executed
 * @param options Extra action options to be applied
 */
export function Post(route?: RegExp, options?: ActionOptions): Function;
export function Post(route?: string, options?: ActionOptions): Function;
export function Post(route?: string|RegExp, options?: ActionOptions): Function {
    return function (object: Object, methodName: string) {
        defaultMetadataStorage.addActionMetadata({
            route: route,
            object: object,
            method: methodName,
            type: ActionType.POST,
            options: options
        });
    }
}

/**
 * Registers an action to be executed when PUT request comes on a given route.
 * Applied to controller class methods.
 *
 * @param route When request comes to this route this action will be executed
 * @param options Extra action options to be applied
 */
export function Put(route?: RegExp, options?: ActionOptions): Function;
export function Put(route?: string, options?: ActionOptions): Function;
export function Put(route?: string|RegExp, options?: ActionOptions): Function {
    return function (object: Object, methodName: string) {
        defaultMetadataStorage.addActionMetadata({
            route: route,
            object: object,
            method: methodName,
            type: ActionType.PUT,
            options: options
        });
    }
}

/**
 * Registers an action to be executed when PATCH request comes on a given route.
 * Applied to controller class methods.
 *
 * @param route When request comes to this route this action will be executed
 * @param options Extra action options to be applied
 */
export function Patch(route?: RegExp, options?: ActionOptions): Function;
export function Patch(route?: string, options?: ActionOptions): Function;
export function Patch(route?: string|RegExp, options?: ActionOptions): Function {
    return function (object: Object, methodName: string) {
        defaultMetadataStorage.addActionMetadata({
            route: route,
            object: object,
            method: methodName,
            type: ActionType.PATCH,
            options: options
        });
    }
}

/**
 * Registers an action to be executed when DELETE request comes on a given route.
 * Applied to controller class methods.
 *
 * @param route When request comes to this route this action will be executed
 * @param options Extra action options to be applied
 */
export function Delete(route?: RegExp, options?: ActionOptions): Function;
export function Delete(route?: string, options?: ActionOptions): Function;
export function Delete(route?: string|RegExp, options?: ActionOptions): Function {
    return function (object: Object, methodName: string) {
        defaultMetadataStorage.addActionMetadata({
            route: route,
            object: object,
            method: methodName,
            type: ActionType.DELETE,
            options: options
        });
    }
}

/**
 * Registers an action to be executed when HEAD request comes on a given route.
 * Applied to controller class methods.
 *
 * @param route When request comes to this route this action will be executed
 * @param options Extra action options to be applied
 */
export function Head(route?: RegExp, options?: ActionOptions): Function;
export function Head(route?: string, options?: ActionOptions): Function;
export function Head(route?: string|RegExp, options?: ActionOptions): Function {
    return function (object: Object, methodName: string) {
        defaultMetadataStorage.addActionMetadata({
            route: route,
            object: object,
            method: methodName,
            type: ActionType.HEAD,
            options: options
        });
    }
}

/**
 * Registers an action to be executed when OPTIONS request comes on a given route.
 * Applied to controller class methods.
 *
 * @param route When request comes to this route this action will be executed
 * @param options Extra action options to be applied
 */
export function Options(route?: RegExp, options?: ActionOptions): Function;
export function Options(route?: string, options?: ActionOptions): Function;
export function Options(route?: string|RegExp, options?: ActionOptions): Function {
    return function (object: Object, methodName: string) {
        defaultMetadataStorage.addActionMetadata({
            route: route,
            object: object,
            method: methodName,
            type: ActionType.OPTIONS,
            options: options
        });
    }
}

/**
 * Registers an action to be executed when request with specified method comes on a given route.
 * Applied to controller class methods.
 *
 * @param method Http method to be registered. All avalible http methods are listed in ActionType class
 * @param route When request comes to this route this action will be executed
 * @param options Extra action options to be applied
 */
export function Method(method: string, route?: RegExp, options?: ActionOptions): Function;
export function Method(method: string, route?: string, options?: ActionOptions): Function;
export function Method(method: string, route?: string|RegExp, options?: ActionOptions): Function {
    return function (object: Object, methodName: string) {
        defaultMetadataStorage.addActionMetadata({
            route: route,
            object: object,
            method: methodName,
            type: method,
            options: options
        });
    }
}

/**
 * This decorator allows to inject a Request object to the controller action parameter. After that you can fully use
 * Request object in your action method. Applied to class method parameters.
 */
export function Req() {
    return function (object: Object, methodName: string, index: number) {
        defaultMetadataStorage.addParamMetadata({
            object: object,
            method: methodName,
            index: index,
            type: ParamType.REQUEST,
            parseJson: false,
            isRequired: false
        });
    }
}

/**
 * This decorator allows to inject a Response object to the controller action parameter. After that you can fully use
 * Response object in your action method. Applied to class method parameters.
 */
export function Res() {
    return function (object: Object, methodName: string, index: number) {
        defaultMetadataStorage.addParamMetadata({
            object: object,
            method: methodName,
            index: index,
            type: ParamType.RESPONSE,
            parseJson: false,
            isRequired: false
        });
    }
}

/**
 * This decorator allows to inject a request body value to the controller action parameter.
 * Applied to class method parameters.
 *
 * @param options Extra parameter options
 */
export function Body(options: ParamOptions): Function;
export function Body(required?: boolean, parseJson?: boolean): Function;
export function Body(requiredOrOptions: ParamOptions|boolean, parseJson?: boolean) {
    let required = false;
    if (typeof requiredOrOptions === 'object') {
        required = requiredOrOptions.required;
        parseJson = requiredOrOptions.parseJson;
    } else {
        required = <boolean> requiredOrOptions;
    }

    return function (object: Object, methodName: string, index: number) {
        const format = Reflect.getMetadata('design:paramtypes', object, methodName)[index];
        defaultMetadataStorage.addParamMetadata({
            object: object,
            method: methodName,
            index: index,
            type: ParamType.BODY,
            format: format,
            parseJson: parseJson,
            isRequired: required
        });
    }
}

/**
 * This decorator allows to inject a route parameter value to the controller action parameter.
 * Applied to class method parameters.
 *
 * @param name Parameter name
 * @param options Extra parameter options
 */
export function Param(name: string, options: ParamOptions): Function;
export function Param(name: string, required?: boolean, parseJson?: boolean): Function;
export function Param(name: string, requiredOrOptions: ParamOptions|boolean, parseJson?: boolean) {
    let required = false;
    if (typeof requiredOrOptions === 'object') {
        required = requiredOrOptions.required;
        parseJson = requiredOrOptions.parseJson;
    } else {
        required = <boolean> requiredOrOptions;
    }

    return function (object: Object, methodName: string, index: number) {
        let format = Reflect.getMetadata('design:paramtypes', object, methodName)[index];
        defaultMetadataStorage.addParamMetadata({
            object: object,
            method: methodName,
            index: index,
            type: ParamType.PARAM,
            name: name,
            format: format,
            parseJson: parseJson,
            isRequired: required
        });
    }
}

/**
 * This decorator allows to inject a query parameter value to the controller action parameter.
 * Applied to class method parameters.
 *
 * @param name Parameter name
 * @param options Extra parameter options
 */
export function QueryParam(name: string, options: ParamOptions): Function;
export function QueryParam(name: string, required?: boolean, parseJson?: boolean): Function;
export function QueryParam(name: string, requiredOrOptions: ParamOptions|boolean, parseJson?: boolean) {
    let required = false;
    if (typeof requiredOrOptions === 'object') {
        required = requiredOrOptions.required;
        parseJson = requiredOrOptions.parseJson;
    } else {
        required = <boolean> requiredOrOptions;
    }

    return function (object: Object, methodName: string, index: number) {
        const format = Reflect.getMetadata('design:paramtypes', object, methodName)[index];
        defaultMetadataStorage.addParamMetadata({
            object: object,
            method: methodName,
            index: index,
            type: ParamType.QUERY,
            name: name,
            format: format,
            parseJson: parseJson,
            isRequired: required
        });
    }
}

/**
 * This decorator allows to inject a request body's value to the controller action parameter.
 * Applied to class method parameters.
 *
 * @param name Body's parameter name
 * @param options Extra parameter options
 */
export function BodyParam(name: string, options: ParamOptions): Function;
export function BodyParam(name: string, required?: boolean, parseJson?: boolean): Function;
export function BodyParam(name: string, requiredOrOptions: ParamOptions|boolean, parseJson?: boolean) {
    let required = false;
    if (typeof requiredOrOptions === 'object') {
        required = requiredOrOptions.required;
        parseJson = requiredOrOptions.parseJson;
    } else {
        required = <boolean> requiredOrOptions;
    }

    return function (object: Object, methodName: string, index: number) {
        let format = Reflect.getMetadata('design:paramtypes', object, methodName)[index];
        defaultMetadataStorage.addParamMetadata({
            object: object,
            method: methodName,
            index: index,
            type: ParamType.BODY_PARAM,
            name: name,
            format: format,
            parseJson: parseJson,
            isRequired: required
        });
    }
}

/**
 * This decorator allows to inject a cookie value to the controller action parameter.
 * Applied to class method parameters.
 *
 * @param name Cookie parameter name
 * @param options Extra parameter options
 */
export function CookieParam(name: string, options: ParamOptions): Function;
export function CookieParam(name: string, required?: boolean, parseJson?: boolean): Function;
export function CookieParam(name: string, requiredOrOptions: ParamOptions|boolean, parseJson?: boolean) {
    let required = false;
    if (typeof requiredOrOptions === 'object') {
        required = requiredOrOptions.required;
        parseJson = requiredOrOptions.parseJson;
    } else {
        required = <boolean> requiredOrOptions;
    }

    return function (object: Object, methodName: string, index: number) {
        let format = Reflect.getMetadata('design:paramtypes', object, methodName)[index];
        defaultMetadataStorage.addParamMetadata({
            object: object,
            method: methodName,
            index: index,
            type: ParamType.COOKIE,
            name: name,
            format: format,
            parseJson: parseJson,
            isRequired: required
        });
    }
}

/**
 * Annotation must be set to controller action and given to it code will be used as HTTP Status Code in the case
 * if response result is success.
 */
export function SuccessHttpCode(code: number) {
    return function (object: Object, methodName: string) {
        defaultMetadataStorage.addResponsePropertyMetadata({
            value: code,
            object: object,
            method: methodName,
            type: ResponsePropertyType.SUCCESS_CODE
        });
    }
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
    }
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
    }
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
    }
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
    }
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
    }
}