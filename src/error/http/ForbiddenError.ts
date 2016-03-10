import {HttpError} from "./HttpError";

/**
 * Exception for 403 HTTP error.
 */
export class ForbiddenError extends HttpError {
    name = "ForbiddenError";

    constructor(message?: string) {
        super(403);
        if (message)
            this.message = message;
    }

}