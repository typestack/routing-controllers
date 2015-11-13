import {HttpError} from "./HttpError";

export class MethodNotAllowedError extends HttpError {
    name = 'MethodNotAllowedError';

    constructor(message?: string) {
        super(404);
        if (message)
            this.message = message;
    }

}