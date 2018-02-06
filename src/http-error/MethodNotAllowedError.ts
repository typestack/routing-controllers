import {HttpError} from "./HttpError";

/**
 * Exception for 405 HTTP error.
 */
export class MethodNotAllowedError extends HttpError {
    name = "MethodNotAllowedError";

    constructor(message?: string) {
        super(405);
        Object.setPrototypeOf(this, MethodNotAllowedError.prototype);

        if (message)
            this.message = message;
    }

}