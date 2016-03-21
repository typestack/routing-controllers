import {BadRequestError} from "./http/BadRequestError";

/**
 * Caused when parameter is required, but is not specified by a user.
 */
export class ParameterRequiredError extends BadRequestError {
    name = "ParameterRequiredError";

    constructor(url: string, method: string, parameterName: string) {
        super("Parameter " + parameterName + " is required for request on " + method + " " + url);
    }

}