import {HttpError} from "./HttpError";

/**
 * Exception for 404 HTTP error.
 */
export class NotFoundError extends HttpError {
    name = 'NotFoundError';

    constructor(message?: string) {
        super(404);
        if (message)
            this.message = message;
    }

}