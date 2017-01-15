import {HttpError} from "../error/http/HttpError";
import {ClassTransformOptions} from "class-transformer";

/**
 * Base driver functionality for all other drivers.
 */
export class BaseDriver {

    // -------------------------------------------------------------------------
    // Public Properties
    // -------------------------------------------------------------------------

    useClassTransformer: boolean;

    /**
     * Global class transformer options passed to class-transformer during classToPlain operation.
     * This operation is being executed when server returns response to user.
     */
    classToPlainTransformOptions: ClassTransformOptions;

    /**
     * Global class transformer options passed to class-transformer during plainToClass operation.
     * This operation is being executed when parsing user parameters.
     */
    plainToClassTransformOptions: ClassTransformOptions;

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
            const name = error.name && error.name !== "Error" ? error.name : error.constructor.name;

            if (name && (this.developmentMode || error.message)) // show name only if in debug mode and if error message exist too
                processedError.name = name;
            if (error.message)
                processedError.message = error.message;
            if (error.stack && this.developmentMode)
                processedError.stack = error.stack;

            Object.keys(error)
                .filter(key => key !== "stack" && key !== "name" && key !== "message" && (!(error instanceof HttpError) || key !== "httpCode"))
                .forEach(key => processedError[key] = (error as any)[key]);

            if (this.errorOverridingMap)
                Object.keys(this.errorOverridingMap)
                    .filter(key => name === key)
                    .forEach(key => processedError = this.merge(processedError, this.errorOverridingMap[key]));

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

    private merge(obj1: any, obj2: any): any {
        const result: any = {};
        for (let i in obj1) {
            if ((i in obj2) && (typeof obj1[i] === "object") && (i !== null)) {
                result[i] = this.merge(obj1[i], obj2[i]);
            } else {
                result[i] = obj1[i];
            }
        }
        for (let i in obj2) {
            result[i] = obj2[i];
        }
        return result;
    }

}
