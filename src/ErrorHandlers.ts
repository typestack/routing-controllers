import {HttpError} from "./error/http/HttpError";
import {Utils} from "./Utils";

export function jsonErrorHandler(error: any, isDebug: boolean, errorOverridingMap: any): any {
    let actionError: any = {};
    if (error instanceof Error) {
        if (error.name && (isDebug || error.message)) // show name only if in debug mode and if error message exist too
            actionError.name = error.name;
        if (error.message)
            actionError.message = error.message;
        if (error.stack && isDebug)
            actionError.stack = error.stack;

        Object.keys(error)
            .filter(key => key !== 'stack' && key !== 'name' && key !== 'message' && key !== 'httpCode')
            .forEach(key => actionError[key] = error[key]);

        if (errorOverridingMap) {
            Object.keys(errorOverridingMap).forEach(key => {
                if (error.name === key)
                    actionError = Utils.merge(actionError, errorOverridingMap[key]);
            });
        }

    } else if (isDebug) {
        actionError['error'] = error;
    }

    return Object.keys(actionError).length > 0 ? actionError : undefined;
}

export function defaultErrorHandler(error: any): any {
    if (error instanceof Error) {
        if (error.message)
            return error.message;
    }
}