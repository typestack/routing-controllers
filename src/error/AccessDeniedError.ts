import {Action} from "../Action";
import {HttpError} from "../http-error/HttpError";

/**
 * Thrown when route is guarded by @Authorized decorator.
 */
export class AccessDeniedError extends HttpError {

    name = "AccessDeniedError";

    constructor(action: Action) {
        super(403);
        Object.setPrototypeOf(this, AccessDeniedError.prototype);
        const uri = action.request.method + " " + action.request.url; // todo: check it it works in koa
        this.message = `Access is denied for request on ${uri}`;
    }

}