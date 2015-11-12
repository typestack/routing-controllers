import {BadRequestError} from "./http/BadRequestError";

export class ParameterParseJsonError extends BadRequestError {
    name = 'ParameterParseJsonError';

    constructor(parameterName: string, value: any) {
        super('Given parameter "' + parameterName + '" is invalid. Value (' + JSON.stringify(value) + ') cannot be parsed to JSON');
    }

}