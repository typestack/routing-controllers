import {ParamMetadata, ParamType} from "./metadata/ParamMetadata";
import {ParameterRequiredError} from "./error/ParameterRequiredError";
import {BodyRequiredError} from "./error/BodyRequiredError";
import {ParameterParseJsonError} from "./error/ParameterParseJsonError";
import {Server} from "./server/Server";
import {Utils} from "./Utils";

/**
 * Helps to handle parameters.
 */
export class ParamHandler {

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private framework: Server) {
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    handleParam(request: any, response: any, param: ParamMetadata): any {
        let value: any;
        switch (param.type) {
            case ParamType.REQUEST:
                value = request;
                break;
            case ParamType.RESPONSE:
                value = response;
                break;
            default:
                value = this.framework.getParamFromRequest(request, param.name, param.type);
                if (value)
                    value = this.handleParamFormat(value, param);
                break;
        }

        if (param.name && param.isRequired && (value === null || value === undefined)) {
            throw new ParameterRequiredError(request.url, request.method, param.name);

        } else if (!param.name && param.isRequired && (value === null || value === undefined || (value instanceof Object && Object.keys(value).length === 0))) {
            throw new BodyRequiredError(request.url, request.method);
        }

        return value;
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    private handleParamFormat(value: any, paramMetadata: ParamMetadata): any {
        const format = paramMetadata.format;
        const formatName = format instanceof Function && format.name ? format.name : format instanceof String ? format : "";
        switch (formatName.toLowerCase()) {
            case "number":
                return +value;

            case "string":
                return value;

            case "boolean":
                return !!value;

            default:
                if (value && paramMetadata.parseJson)
                    return this.parseValue(value, paramMetadata);
        }
        return value;
    }

    private parseValue(value: any, paramMetadata: ParamMetadata) {
        try {
            const parseValue = JSON.parse(value);
            if (paramMetadata.format) {
                return Utils.merge(new paramMetadata.format(), parseValue);
            } else {
                return parseValue;
            }
        } catch (er) {
            throw new ParameterParseJsonError(paramMetadata.name, value);
        }
    }


}