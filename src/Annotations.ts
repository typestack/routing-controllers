import 'reflect-metadata';
import {defaultActionRegistry} from "./ActionRegistry";
import {ActionTypes} from "./ActionMetadata";
import {ControllerTypes} from "./ControllerMetadata";
import {ExtraParamTypes} from "./ExtraParamMetadata";

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

export function Body(parseJson: boolean = false) {
    return function (object: Object, methodName: string, index: number) {
        let format = Reflect.getMetadata('design:paramtypes', object, methodName)[index];
        defaultActionRegistry.addExtraParam({ object: object, methodName: methodName,  index: index, type: ExtraParamTypes.BODY, format: format, parseJson: parseJson });
    }
}

export function Param(name: string, parseJson: boolean = false) {
    return function (object: Object, methodName: string, index: number) {
        let format = Reflect.getMetadata('design:paramtypes', object, methodName)[index];
        defaultActionRegistry.addExtraParam({ object: object, methodName: methodName, index: index, type: ExtraParamTypes.PARAM, name: name, format: format, parseJson: parseJson });
    }
}

export function QueryParam(name: string, parseJson: boolean = false) {
    return function (object: Object, methodName: string, index: number) {
        let format = Reflect.getMetadata('design:paramtypes', object, methodName)[index];
        defaultActionRegistry.addExtraParam({ object: object, methodName: methodName, index: index, type: ExtraParamTypes.QUERY, name: name, format: format, parseJson: parseJson });
    }
}

export function BodyParam(name: string, parseJson: boolean = false) {
    return function (object: Object, methodName: string, index: number) {
        let format = Reflect.getMetadata('design:paramtypes', object, methodName)[index];
        defaultActionRegistry.addExtraParam({ object: object, methodName: methodName, index: index, type: ExtraParamTypes.BODY_PARAM, name: name, format: format, parseJson: parseJson });
    }
}

export function CookieParam(name: string, parseJson: boolean = false) {
    return function (object: Object, methodName: string, index: number) {
        let format = Reflect.getMetadata('design:paramtypes', object, methodName)[index];
        defaultActionRegistry.addExtraParam({ object: object, methodName: methodName, index: index, type: ExtraParamTypes.COOKIE, name: name, format: format, parseJson: parseJson });
    }
}
