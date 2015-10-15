export class JsonParameterParseException extends Error {
    name = 'JsonParameterParseException';

    constructor(parameterName: string, value: any) {
        super();
        this.message = 'Given parameter\'s (' + parameterName + ') value (' + JSON.stringify(value) + ' cannot be parsed to JSON';
    }

}