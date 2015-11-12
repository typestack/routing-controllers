import {HttpError} from "./HttpError";

export class UnauthorizedError extends HttpError {
    name = 'UnauthorizedError';

    constructor(message: string) {
        super(401);
        if (message)
            this.message = message;
    }

}