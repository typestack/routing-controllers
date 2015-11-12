import 'reflect-metadata';
import {defaultMetadataStorage} from "./metadata/MetadataStorage";
import {ActionType} from "./metadata/ActionMetadata";
import {HttpCodeType} from "./metadata/HttpCodeMetadata";
import {ControllerType} from "./metadata/ControllerMetadata";
import {ParamType, ParamOptions} from "./metadata/ParamMetadata";
import {ActionOptions} from "./metadata/ActionMetadata";

export function SuccessHttpCode(code: number) {
    return function (object: Object, methodName: string) {
        defaultMetadataStorage.addHttpCodeMetadata({
            code: code,
            object: object,
            method: methodName,
            type: HttpCodeType.SUCCESS
        });
    }
}

export function JsonController(path?: string) {
    return function (object: Function) {
        defaultMetadataStorage.addControllerMetadata({
            path: path,
            object: object,
            type: ControllerType.JSON
        });
    }
}

export function Controller(path?: string) {
    return function (object: Function) {
        defaultMetadataStorage.addControllerMetadata({
            path: path,
            object: object,
            type: ControllerType.DEFAULT
        });
    }
}

export function Get(path?: string, options?: ActionOptions) {
    return function (object: Object, methodName: string) {
        defaultMetadataStorage.addActionMetadata({
            path: path,
            object: object,
            method: methodName,
            type: ActionType.GET,
            options: options
        });
    }
}

export function Post(path?: string, options?: ActionOptions) {
    return function (object: Object, methodName: string) {
        defaultMetadataStorage.addActionMetadata({
            path: path,
            object: object,
            method: methodName,
            type: ActionType.POST,
            options: options
        });
    }
}

export function Put(path?: string, options?: ActionOptions) {
    return function (object: Object, methodName: string) {
        defaultMetadataStorage.addActionMetadata({
            path: path,
            object: object,
            method: methodName,
            type: ActionType.PUT,
            options: options
        });
    }
}

export function Patch(path?: string, options?: ActionOptions) {
    return function (object: Object, methodName: string) {
        defaultMetadataStorage.addActionMetadata({
            path: path,
            object: object,
            method: methodName,
            type: ActionType.PATCH,
            options: options
        });
    }
}

export function Delete(path?: string, options?: ActionOptions) {
    return function (object: Object, methodName: string) {
        defaultMetadataStorage.addActionMetadata({
            path: path,
            object: object,
            method: methodName,
            type: ActionType.DELETE,
            options: options
        });
    }
}

export function Head(path?: string, options?: ActionOptions) {
    return function (object: Object, methodName: string) {
        defaultMetadataStorage.addActionMetadata({
            path: path,
            object: object,
            method: methodName,
            type: ActionType.HEAD,
            options: options
        });
    }
}

export function Options(path?: string, options?: ActionOptions) {
    return function (object: Object, methodName: string) {
        defaultMetadataStorage.addActionMetadata({
            path: path,
            object: object,
            method: methodName,
            type: ActionType.OPTIONS,
            options: options
        });
    }
}

export function Method(method: string, path?: string, options?: ActionOptions) {
    return function (object: Object, methodName: string) {
        defaultMetadataStorage.addActionMetadata({
            path: path,
            object: object,
            method: methodName,
            type: method,
            options: options
        });
    }
}

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
        let format = Reflect.getMetadata('design:paramtypes', object, methodName)[index];
        defaultMetadataStorage.addParamMetadata({
            object: object,
            methodName: methodName,
            index: index,
            type: ParamType.BODY,
            format: format,
            parseJson: parseJson,
            isRequired: required
        });
    }
}

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
            methodName: methodName,
            index: index,
            type: ParamType.PARAM,
            name: name,
            format: format,
            parseJson: parseJson,
            isRequired: required
        });
    }
}

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
        let format = Reflect.getMetadata('design:paramtypes', object, methodName)[index];
        defaultMetadataStorage.addParamMetadata({
            object: object,
            methodName: methodName,
            index: index,
            type: ParamType.QUERY,
            name: name,
            format: format,
            parseJson: parseJson,
            isRequired: required
        });
    }
}

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
            methodName: methodName,
            index: index,
            type: ParamType.BODY_PARAM,
            name: name,
            format: format,
            parseJson: parseJson,
            isRequired: required
        });
    }
}

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
            methodName: methodName,
            index: index,
            type: ParamType.COOKIE,
            name: name,
            format: format,
            parseJson: parseJson,
            isRequired: required
        });
    }
}

export function Req() {
    return function (object: Object, methodName: string, index: number) {
        defaultMetadataStorage.addParamMetadata({
            object: object,
            methodName: methodName,
            index: index,
            type: ParamType.REQUEST,
            parseJson: false,
            isRequired: false
        });
    }
}

export function Res() {
    return function (object: Object, methodName: string, index: number) {
        defaultMetadataStorage.addParamMetadata({
            object: object,
            methodName: methodName,
            index: index,
            type: ParamType.RESPONSE,
            parseJson: false,
            isRequired: false
        });
    }
}
