import {BadRequestError} from "./http/BadRequestError";

/**
 * Caused when body is required, but not given in the user request.
 */
export class BodyRequiredError extends BadRequestError {
    name = "BodyRequiredError";

    constructor(url: string, method: string) {
        super("Request body is required for request on " + method + " " + url);
    }

}