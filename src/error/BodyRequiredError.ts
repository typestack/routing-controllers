import {BadRequestError} from "../http-error/BadRequestError";

/**
 * Caused when body is required, but not given in the user request.
 */
export class BodyRequiredError extends BadRequestError {
    name = "BodyRequiredError";

    constructor(url: string, method: string) {
        super(`Request body is required for request on ${method} ${url}`);
        Object.setPrototypeOf(this, BodyRequiredError.prototype);
    }

}