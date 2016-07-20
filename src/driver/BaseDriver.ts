import {HttpError} from "../error/http/HttpError";
import {Utils} from "../util/Utils";

/**
 * Base driver functionality for all other drivers.
 */
export class BaseDriver {

    // -------------------------------------------------------------------------
    // Public Properties
    // -------------------------------------------------------------------------

    useConstructorUtils: boolean;
    isDefaultErrorHandlingEnabled: boolean;
    developmentMode: boolean;
    errorOverridingMap: { [key: string]: any };
    routePrefix: string = "";

    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------

    protected processJsonError(error: any) {
        if (!this.isDefaultErrorHandlingEnabled)
            return error;

        let processedError: any = {};
        if (error instanceof Error) {
            if (error.name && (this.developmentMode || error.message)) // show name only if in debug mode and if error message exist too
                processedError.name = error.name;
            if (error.message)
                processedError.message = error.message;
            if (error.stack && this.developmentMode)
                processedError.stack = error.stack;

            Object.keys(error)
                .filter(key => key !== "stack" && key !== "name" && key !== "message" && (!(error instanceof HttpError) || key !== "httpCode"))
                .forEach(key => processedError[key] = error[key]);

            if (this.errorOverridingMap)
                Object.keys(this.errorOverridingMap)
                    .filter(key => error.name === key)
                    .forEach(key => processedError = Utils.merge(processedError, this.errorOverridingMap[key]));

            return Object.keys(processedError).length > 0 ? processedError : undefined;
        }

        return error;
    }

    protected processTextError(error: any) {
        if (!this.isDefaultErrorHandlingEnabled)
            return error;

        if (error instanceof Error) {
            if (this.developmentMode && error.stack) {
                return error.stack;

            } else if (error.message) {
                return error.message;
            }
        }
        return error;
    }

}
