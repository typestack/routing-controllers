import {BadRequestError} from "../http-error/BadRequestError";
import {ActionProperties} from "../ActionProperties";
import {ParamMetadata} from "../metadata/ParamMetadata";

/**
 * Caused when parameter is required, but is not specified by a user.
 */
export class ParameterRequiredError extends BadRequestError {
    name = "ParameterRequiredError";

    constructor(param: ParamMetadata, actionProperties: ActionProperties) {
        super();
        const parameterName = param.name;
        const url = actionProperties.request.url; // todo: check if it works in koa
        const method = actionProperties.request.method;
        this.message = `Parameter ${parameterName} is required for request on ${method} ${url}`;
        Object.setPrototypeOf(this, ParameterRequiredError.prototype);
    }

}