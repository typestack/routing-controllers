import {ActionProperties} from "../ActionProperties";
import {ForbiddenError} from "../http-error/ForbiddenError";

/**
 * Thrown when authorization is required thought @CurrentUser decorator.
 */
export class AuthorizationRequiredError extends ForbiddenError {

    name = "AuthorizationRequiredError";

    constructor(actionProperties: ActionProperties) {
        super();
        Object.setPrototypeOf(this, AuthorizationRequiredError.prototype);
        const uri = actionProperties.request.method + " " + actionProperties.request.url; // todo: check it it works in koa
        this.message = `Authorization is required for request on ${uri}`;
    }

}