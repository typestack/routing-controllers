import {Action} from "../Action";
import {UnauthorizedError} from "../http-error/UnauthorizedError";

/**
 * Thrown when route is guarded by @Authorized decorator.
 */
export class AccessDeniedError extends UnauthorizedError {

    name = "AccessDeniedError";

    constructor(action: Action) {
        super();
        Object.setPrototypeOf(this, AccessDeniedError.prototype);
        const uri = action.request.method + " " + action.request.url; // todo: check it it works in koa
        this.message = `Access is denied for request on ${uri}`;
    }

}