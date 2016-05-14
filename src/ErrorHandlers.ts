import {Utils} from "./Utils";

/**
 * Default json error handler. When controller action produces an error, it transforms this error into desired result
 * that will be returned to a user. Applies to json responses.
 *
 * @param error Error to be handled
 * @param isDebug Indicates if debug mode is enabled or not. In debug mode some extra information will be exposed
 * @param errorOverridingMap Special data map that is used to override any property of the handled result.
 * @returns Transformed error.
 */
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
            .filter(key => key !== "stack" && key !== "name" && key !== "message" && key !== "httpCode")
            .forEach(key => actionError[key] = error[key]);

        if (errorOverridingMap)
            Object.keys(errorOverridingMap)
                .filter(key => error.name === key)
                .forEach(key => actionError = Utils.merge(actionError, errorOverridingMap[key]));

    } else if (isDebug) {
        actionError["error"] = error;
    }

    return Object.keys(actionError).length > 0 ? actionError : undefined;
}

/**
 * Default error handler. When controller action produces an error, it transforms this error into desired result
 * that will be returned to a user. Applies to regular responses.
 *
 * @param error Error to be handled
 * @returns Transformed error.
 */
export function defaultErrorHandler(error: any): any {
    if (error instanceof Error) {
        if (error.message)
            return error.message;
    }
    return error;
}