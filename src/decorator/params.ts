import "reflect-metadata";
import {defaultMetadataStorage} from "./../metadata/MetadataStorage";
import {ActionType} from "./../metadata/ActionMetadata";
import {ResponsePropertyType} from "./../metadata/ResponsePropertyMetadata";
import {ControllerType} from "./../metadata/ControllerMetadata";
import {ParamType, ParamOptions} from "./../metadata/ParamMetadata";
import {ActionOptions} from "./../metadata/ActionMetadata";



/**
 * This decorator allows to inject a Request object to the controller action parameter. After that you can fully use
 * Request object in your action method. Applied to class method parameters.
 */
export function Next() {
    return function (object: Object, methodName: string, index: number) {
        defaultMetadataStorage.addParamMetadata({
            object: object,
            method: methodName,
            index: index,
            type: ParamType.NEXT_FN,
            parseJson: false,
            isRequired: false
        });
    };
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
    };
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
    };
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
    if (typeof requiredOrOptions === "object") {
        required = requiredOrOptions.required;
        parseJson = requiredOrOptions.parseJson;
    } else {
        required = <boolean> requiredOrOptions;
    }

    return function (object: Object, methodName: string, index: number) {
        const format = Reflect.getMetadata("design:paramtypes", object, methodName)[index];
        defaultMetadataStorage.addParamMetadata({
            object: object,
            method: methodName,
            index: index,
            type: ParamType.BODY,
            format: format,
            parseJson: parseJson,
            isRequired: required
        });
    };
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
    if (typeof requiredOrOptions === "object") {
        required = requiredOrOptions.required;
        parseJson = requiredOrOptions.parseJson;
    } else {
        required = <boolean> requiredOrOptions;
    }

    return function (object: Object, methodName: string, index: number) {
        let format = Reflect.getMetadata("design:paramtypes", object, methodName)[index];
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
    };
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
    if (typeof requiredOrOptions === "object") {
        required = requiredOrOptions.required;
        parseJson = requiredOrOptions.parseJson;
    } else {
        required = <boolean> requiredOrOptions;
    }

    return function (object: Object, methodName: string, index: number) {
        const format = Reflect.getMetadata("design:paramtypes", object, methodName)[index];
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
    };
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
    if (typeof requiredOrOptions === "object") {
        required = requiredOrOptions.required;
        parseJson = requiredOrOptions.parseJson;
    } else {
        required = <boolean> requiredOrOptions;
    }

    return function (object: Object, methodName: string, index: number) {
        let format = Reflect.getMetadata("design:paramtypes", object, methodName)[index];
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
    };
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
    if (typeof requiredOrOptions === "object") {
        required = requiredOrOptions.required;
        parseJson = requiredOrOptions.parseJson;
    } else {
        required = <boolean> requiredOrOptions;
    }

    return function (object: Object, methodName: string, index: number) {
        let format = Reflect.getMetadata("design:paramtypes", object, methodName)[index];
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
    };
}
