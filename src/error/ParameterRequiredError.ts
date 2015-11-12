import {BadRequestError} from "./http/BadRequestError";

export class ParameterRequiredError extends BadRequestError {
    name = 'ParameterRequiredError';

    constructor(url: string, method: string, parameterName: string) {
        super('Parameter "' + parameterName + '" is required for request on ' + method + ' ' + url);
    }

}