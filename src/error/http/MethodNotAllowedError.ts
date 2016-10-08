import {HttpError} from "./HttpError";

/**
 * Exception for todo HTTP error.
 */
export class MethodNotAllowedError extends HttpError {
    name = "MethodNotAllowedError";

    constructor(message?: string) {
        super(405);
        if (message)
            this.message = message;
    }

}