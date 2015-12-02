import {BadRequestError} from "./http/BadRequestError";

/**
 * Caused when user parameter is given, but is invalid and cannot be parsed.
 */
export class ParameterParseJsonError extends BadRequestError {
    name = 'ParameterParseJsonError';

    constructor(parameterName: string, value: any) {
        super('Given parameter "' + parameterName + '" is invalid. Value (' + JSON.stringify(value) + ') cannot be parsed to JSON');
    }

}