import {HttpError} from "./HttpError";

/**
 * Exception for 400 HTTP error.
 */
export class BadRequestError extends HttpError {
    name = 'BadRequestError';

    constructor(message?: string) {
        super(400);
        if (message)
            this.message = message;
    }

}