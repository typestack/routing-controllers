import {HttpError} from "./HttpError";

export class InternalServerError extends HttpError {
    name = 'InternalServerError';

    constructor(message: string) {
        super(403);
        if (message)
            this.message = message;
    }

}