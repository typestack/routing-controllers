import {ParameterParseJsonError} from "./error/ParameterParseJsonError";
import {Driver} from "./driver/Server";
import {Utils} from "./Utils";
import {plainToConstructor} from "constructor-utils";
import {ParamMetadataArgs} from "./metadata/args/ParamMetadataArgs";
import {ParamTypes} from "./metadata/types/ParamTypes";
import {IncomingMessage, ServerResponse} from "http";
import {ParamMetadata} from "./metadata/ParamMetadata";

/**
 * Helps to handle parameters.
 */
export class ParamHandler {

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private framework: Driver) {
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    handleParam(request: IncomingMessage, response: ServerResponse, param: ParamMetadata): Promise<any> {

        if (param.type === ParamTypes.REQUEST)
            return Promise.resolve(request);

        if (param.type === ParamTypes.RESPONSE)
            return Promise.resolve(response);

        let value: any, originalValue: any;
        value = originalValue = this.framework.getParamFromRequest(request, param);
        if (value)
            value = this.handleParamFormat(value, param);
        
        const isValueEmpty = value === null || value === undefined;
        const isValueEmptyObject = value instanceof Object && Object.keys(value).length === 0;

        // check cases when parameter is required but its empty and throw errors in such cases
        if (param.isRequired) {
            // todo: make better error messages here
            if (param.name && isValueEmpty) {
                return Promise.reject("Parameter " + param.name + " is required for request on " + request.method + " " + request.url);

            } else if (!param.name && (isValueEmpty || isValueEmptyObject)) {
                return Promise.reject("Request body is required for request on " + request.method + " " + request.url);
            }
        }

        // if transform function is given for this param then apply it
        if (param.transform)
            value = param.transform(value, request, response);
        
        const promiseValue = Utils.isPromise(value) ? value : Promise.resolve(value);
        return promiseValue.then((value: any) => {

            if (param.isRequired && originalValue !== null && originalValue !== undefined && isValueEmpty) {
                // TODO: handleResultOptions.errorHttpCode = 404; // maybe throw ErrorNotFoundError here?
                const contentType = param.target && param.target.name ? param.target.name : "content";
                const message = param.name ? ` with ${param.name}='${originalValue}'` : ``;
                return Promise.reject(`Requested ${contentType + message} was not found`);
            }

            return value;
        });
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    private handleParamFormat(value: any, param: ParamMetadata): any {
        const format = param.format;
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
                if (value && (param.parseJson || isObjectFormat))
                    value = this.parseValue(value, param);
        }
        return value;
    }

    private parseValue(value: any, paramMetadata: ParamMetadataArgs) {
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