import {ParamMetadata, ParamType} from "./metadata/ParamMetadata";
import {ParameterRequiredError} from "./error/ParameterRequiredError";
import {BodyRequiredError} from "./error/BodyRequiredError";
import {ParameterParseJsonError} from "./error/ParameterParseJsonError";
import {Server} from "./server/Server";
import {Utils} from "./Utils";
import {plainToConstructor} from "constructor-utils/constructor-utils";
import {ResultHandleOptions} from "./ResultHandleOptions";

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

    handleParam(request: any, response: any, param: ParamMetadata, handleResultOptions: ResultHandleOptions): Promise<any> {
        let value: any, originalValue: any;
        switch (param.type) {
            case ParamType.REQUEST:
                value = request;
                break;
            case ParamType.RESPONSE:
                value = response;
                break;
            default:
                value = originalValue = this.framework.getParamFromRequest(request, param.name, param.type);
                if (value)
                    value = this.handleParamFormat(value, param);
                break;
        }
        
        if (param.name && param.isRequired && (value === null || value === undefined)) {
            return Promise.reject("Parameter " + param.name + " is required for request on " + request.method + " " + request.url);

        } else if (!param.name && param.isRequired && (value === null || value === undefined || (value instanceof Object && Object.keys(value).length === 0))) {
            return Promise.reject("Request body is required for request on " + request.method + " " + request.url);
        }

        if (param.transform)
            value = param.transform(value);
        
        const promiseValue = Utils.isPromise(value) ? value : Promise.resolve(value);
        return promiseValue.then((value: any) => {

            if (param.isRequired && originalValue !== null && originalValue !== undefined && (value === null || value === undefined)) {
                handleResultOptions.errorHttpCode = 404;
                const contentType = param.format && param.format.name ? param.format.name : "content";
                const message = param.name ? ` with ${param.name}='${originalValue}'` : ``;
                return Promise.reject(`Requested ${contentType + message} was not found`);
            }

            return value;
        });
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
                const isObjectFormat = format instanceof Function || formatName.toLowerCase() === "object";
                if (value && (paramMetadata.parseJson || isObjectFormat))
                    value = this.parseValue(value, paramMetadata);
        }
        return value;
    }

    private parseValue(value: any, paramMetadata: ParamMetadata) {
        try {
            const parseValue = typeof value === "string" ? JSON.parse(value) : value;
            if (paramMetadata.format) {
                return plainToConstructor(paramMetadata.format, parseValue);
            } else {
                return parseValue;
            }
        } catch (er) {
            throw new ParameterParseJsonError(paramMetadata.name, value);
        }
    }


}