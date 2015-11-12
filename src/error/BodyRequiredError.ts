import {BadRequestError} from "./http/BadRequestError";

export class BodyRequiredError extends BadRequestError {
    name = 'BodyRequiredError';

    constructor(url: string, method: string) {
        super('Request body is required for request on ' + method + ' ' + url);
    }

}