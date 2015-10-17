export class ParameterParseJsonException extends Error {
    name = 'ParameterParseJsonException';

    constructor(parameterName: string, value: any) {
        super();
        this.message = 'Given parameter "' + parameterName + '" is invalid. Value (' + JSON.stringify(value) + ') cannot be parsed to JSON';
    }

}