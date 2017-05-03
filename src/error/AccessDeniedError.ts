import {ActionProperties} from "../ActionProperties";
import {ForbiddenError} from "../http-error/ForbiddenError";

/**
 * Thrown when route is guarded by @Authorize decorator.
 */
export class AccessDeniedError extends ForbiddenError {

    name = "AccessDeniedError";

    constructor(actionProperties: ActionProperties) {
        super();
        Object.setPrototypeOf(this, AccessDeniedError.prototype);
        const uri = actionProperties.request.method + " " + actionProperties.request.url; // todo: check it it works in koa
        this.message = `Access is denied for request on ${uri}`;
    }

}