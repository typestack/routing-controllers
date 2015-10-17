export class ParameterRequiredException extends Error {
    name = 'ParameterRequiredException';

    constructor(url: string, method: string, parameterName: string) {
        super();
        this.message = 'Parameter "' + parameterName + '" is required for request on ' + method + ' ' + url;
    }

}