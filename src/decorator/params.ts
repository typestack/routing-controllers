import {defaultMetadataStorage} from "../index";
import {ParamTypes} from "../metadata/types/ParamTypes";
import {ParamOptions} from "./options/ParamOptions";
import {ParamMetadata} from "../metadata/ParamMetadata";

/**
 * This decorator allows to inject a Request object to the controller action parameter. After that you can fully use
 * Request object in your action method. Applied to class method parameters.
 */
export function Req() {
    return function (object: Object, methodName: string, index: number) {
        const metadata: ParamMetadata = {
            object: object,
            method: methodName,
            index: index,
            type: ParamTypes.REQUEST,
            parseJson: false,
            isRequired: false
        };
        defaultMetadataStorage().paramMetadatas.push(metadata);
    };
}

/**
 * This decorator allows to inject a Response object to the controller action parameter. After that you can fully use
 * Response object in your action method. Applied to class method parameters.
 */
export function Res() {
    return function (object: Object, methodName: string, index: number) {
        const metadata: ParamMetadata = {
            object: object,
            method: methodName,
            index: index,
            type: ParamTypes.RESPONSE,
            parseJson: false,
            isRequired: false
        };
        defaultMetadataStorage().paramMetadatas.push(metadata);
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
        const format = (<any> Reflect).getMetadata("design:paramtypes", object, methodName)[index];
        const metadata: ParamMetadata = {
            object: object,
            method: methodName,
            index: index,
            type: ParamTypes.BODY,
            format: format,
            parseJson: parseJson,
            isRequired: required
        };
        defaultMetadataStorage().paramMetadatas.push(metadata);
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
        let format = (<any> Reflect).getMetadata("design:paramtypes", object, methodName)[index];
        const metadata: ParamMetadata = {
            object: object,
            method: methodName,
            index: index,
            type: ParamTypes.PARAM,
            name: name,
            format: format,
            parseJson: parseJson,
            isRequired: required
        };
        defaultMetadataStorage().paramMetadatas.push(metadata);
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
        const format = (<any> Reflect).getMetadata("design:paramtypes", object, methodName)[index];
        const metadata: ParamMetadata = {
            object: object,
            method: methodName,
            index: index,
            type: ParamTypes.QUERY,
            name: name,
            format: format,
            parseJson: parseJson,
            isRequired: required
        };
        defaultMetadataStorage().paramMetadatas.push(metadata);
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
        let format = (<any> Reflect).getMetadata("design:paramtypes", object, methodName)[index];
        const metadata: ParamMetadata = {
            object: object,
            method: methodName,
            index: index,
            type: ParamTypes.BODY_PARAM,
            name: name,
            format: format,
            parseJson: parseJson,
            isRequired: required
        };
        defaultMetadataStorage().paramMetadatas.push(metadata);
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
        let format = (<any> Reflect).getMetadata("design:paramtypes", object, methodName)[index];
        const metadata: ParamMetadata = {
            object: object,
            method: methodName,
            index: index,
            type: ParamTypes.COOKIE,
            name: name,
            format: format,
            parseJson: parseJson,
            isRequired: required
        };
        defaultMetadataStorage().paramMetadatas.push(metadata);
    };
}
