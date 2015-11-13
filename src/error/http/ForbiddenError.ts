import {HttpError} from "./HttpError";

export class ForbiddenError extends HttpError {
    name = 'ForbiddenError';

    constructor(message?: string) {
        super(403);
        if (message)
            this.message = message;
    }

}