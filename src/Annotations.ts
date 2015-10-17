import 'reflect-metadata';
import {defaultActionRegistry} from "./ActionRegistry";
import {ActionTypes} from "./ActionMetadata";
import {ControllerTypes} from "./ControllerMetadata";
import {ExtraParamTypes} from "./ExtraParamMetadata";
import {ExtraParamOptions} from "./ExtraParamMetadata";

export function JsonController(path?: string) {
    return function (object: Function) {
        defaultActionRegistry.addController({ path: path, object: object, type: ControllerTypes.JSON });
    }
}

export function Controller(path?: string) {
    return function (object: Function) {
        defaultActionRegistry.addController({ path: path, object: object, type: ControllerTypes.DEFAULT });
    }
}

export function Get(path?: string) {
    return function (object: Object, methodName: string) {
        defaultActionRegistry.addAction({ path: path, object: object, method: methodName, type: ActionTypes.GET });
    }
}

export function Post(path?: string) {
    return function (object: Object, methodName: string) {
        defaultActionRegistry.addAction({ path: path, object: object, method: methodName, type: ActionTypes.POST });
    }
}

export function Put(path?: string) {
    return function (object: Object, methodName: string) {
        defaultActionRegistry.addAction({ path: path, object: object, method: methodName, type: ActionTypes.PUT });
    }
}

export function Patch(path?: string) {
    return function (object: Object, methodName: string) {
        defaultActionRegistry.addAction({ path: path, object: object, method: methodName, type: ActionTypes.PATCH });
    }
}

export function Delete(path?: string) {
    return function (object: Object, methodName: string) {
        defaultActionRegistry.addAction({ path: path, object: object, method: methodName, type: ActionTypes.DELETE });
    }
}

export function Body(options: ExtraParamOptions): Function;
export function Body(required?: boolean, parseJson?: boolean): Function;
export function Body(requiredOrOptions: ExtraParamOptions|boolean, parseJson?: boolean) {
    let required = false;
    if (typeof requiredOrOptions === 'object') {
        required = requiredOrOptions.required;
        parseJson = requiredOrOptions.parseJson;
    } else {
        required = <boolean> requiredOrOptions;
    }

    return function (object: Object, methodName: string, index: number) {
        let format = Reflect.getMetadata('design:paramtypes', object, methodName)[index];
        defaultActionRegistry.addExtraParam({
            object: object,
            methodName: methodName,
            index: index,
            type: ExtraParamTypes.BODY,
            format: format,
            parseJson: parseJson,
            isRequired: required
        });
    }
}

export function Param(name: string, options: ExtraParamOptions): Function;
export function Param(name: string, required?: boolean, parseJson?: boolean): Function;
export function Param(name: string, requiredOrOptions: ExtraParamOptions|boolean, parseJson?: boolean) {
    let required = false;
    if (typeof requiredOrOptions === 'object') {
        required = requiredOrOptions.required;
        parseJson = requiredOrOptions.parseJson;
    } else {
        required = <boolean> requiredOrOptions;
    }

    return function (object: Object, methodName: string, index: number) {
        let format = Reflect.getMetadata('design:paramtypes', object, methodName)[index];
        defaultActionRegistry.addExtraParam({
            object: object,
            methodName: methodName,
            index: index,
            type: ExtraParamTypes.PARAM,
            name: name,
            format: format,
            parseJson: parseJson,
            isRequired: required
        });
    }
}

export function QueryParam(name: string, options: ExtraParamOptions): Function;
export function QueryParam(name: string, required?: boolean, parseJson?: boolean): Function;
export function QueryParam(name: string, requiredOrOptions: ExtraParamOptions|boolean, parseJson?: boolean) {
    let required = false;
    if (typeof requiredOrOptions === 'object') {
        required = requiredOrOptions.required;
        parseJson = requiredOrOptions.parseJson;
    } else {
        required = <boolean> requiredOrOptions;
    }

    return function (object: Object, methodName: string, index: number) {
        let format = Reflect.getMetadata('design:paramtypes', object, methodName)[index];
        defaultActionRegistry.addExtraParam({
            object: object,
            methodName: methodName,
            index: index,
            type: ExtraParamTypes.QUERY,
            name: name,
            format: format,
            parseJson: parseJson,
            isRequired: required
        });
    }
}

export function BodyParam(name: string, options: ExtraParamOptions): Function;
export function BodyParam(name: string, required?: boolean, parseJson?: boolean): Function;
export function BodyParam(name: string, requiredOrOptions: ExtraParamOptions|boolean, parseJson?: boolean) {
    let required = false;
    if (typeof requiredOrOptions === 'object') {
        required = requiredOrOptions.required;
        parseJson = requiredOrOptions.parseJson;
    } else {
        required = <boolean> requiredOrOptions;
    }

    return function (object: Object, methodName: string, index: number) {
        let format = Reflect.getMetadata('design:paramtypes', object, methodName)[index];
        defaultActionRegistry.addExtraParam({
            object: object,
            methodName: methodName,
            index: index,
            type: ExtraParamTypes.BODY_PARAM,
            name: name,
            format: format,
            parseJson: parseJson,
            isRequired: required
        });
    }
}

export function CookieParam(name: string, options: ExtraParamOptions): Function;
export function CookieParam(name: string, required?: boolean, parseJson?: boolean): Function;
export function CookieParam(name: string, requiredOrOptions: ExtraParamOptions|boolean, parseJson?: boolean) {
    let required = false;
    if (typeof requiredOrOptions === 'object') {
        required = requiredOrOptions.required;
        parseJson = requiredOrOptions.parseJson;
    } else {
        required = <boolean> requiredOrOptions;
    }

    return function (object: Object, methodName: string, index: number) {
        let format = Reflect.getMetadata('design:paramtypes', object, methodName)[index];
        defaultActionRegistry.addExtraParam({
            object: object,
            methodName: methodName,
            index: index,
            type: ExtraParamTypes.COOKIE,
            name: name,
            format: format,
            parseJson: parseJson,
            isRequired: required
        });
    }
}
