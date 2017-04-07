import {BadRequestError} from "../http-error/BadRequestError";
import {ActionProperties} from "../ActionProperties";

/**
 * Caused when body is required, but not given in the user request.
 */
export class BodyRequiredError extends BadRequestError {
    name = "BodyRequiredError";

    constructor(actionProperties: ActionProperties) {
        super();
        const url = actionProperties.request.url; // todo: check if same works in koa driver
        const method = actionProperties.request.method;
        this.message = `Request body is required for request on ${method} ${url}`;
        Object.setPrototypeOf(this, BodyRequiredError.prototype);
    }

}