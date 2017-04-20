import {BadRequestError} from "../http-error/BadRequestError";
import {ParamMetadata} from "../metadata/ParamMetadata";
import {ActionProperties} from "../ActionProperties";

/**
 * Thrown when parameter is required, but was missing in a user request.
 */
export class ParamRequiredError extends BadRequestError {

    name = "BadRequestError";

    constructor(actionProperties: ActionProperties, param: ParamMetadata) {
        super();
        Object.setPrototypeOf(this, ParamRequiredError.prototype);

        let paramName: string;
        switch (param.type) {
            case "body":
                paramName = "Request body is";
                break;

            case "query":
                paramName = "Query parameter is";
                break;

            case "header":
                paramName = "Header is";
                break;

            case "file":
                paramName = "Uploaded file is";
                break;

            case "files":
                paramName = "Uploaded files are";
                break;

            case "session":
                paramName = "Session is";
                break;

            case "cookie":
                paramName = "Cookie is";
                break;

            default:
                paramName = "Parameter is";
        }

        const uri = actionProperties.request.method + " " + actionProperties.request.url; // todo: check it it works in koa
        this.message = `${paramName} required for request on ${uri}`;
    }

}