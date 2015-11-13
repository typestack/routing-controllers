import {HttpError} from "./HttpError";

export class NotAcceptableError extends HttpError {
    name = 'NotAcceptableError';

    constructor(message?: string) {
        super(406);
        if (message)
            this.message = message;
    }

}