import {BadRequestError} from "../http-error/BadRequestError";

/**
 * Caused when user parameter is invalid json string and cannot be parsed.
 */
export class ParameterParseJsonError extends BadRequestError {
    name = "ParameterParseJsonError";

    constructor(parameterName: string, value: any) {
        super(`Given parameter ${parameterName} is invalid. Value (${JSON.stringify(value)}) cannot be parsed into JSON.`);
        Object.setPrototypeOf(this, ParameterParseJsonError.prototype);
    }

}