import {HttpError} from "./HttpError";

export class BadRequestError extends HttpError {
    name = 'BadRequestError';

    constructor(message: string) {
        super(400);
        if (message)
            this.message = message;
    }

}