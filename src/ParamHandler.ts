import {ActionCallbackOptions} from "./ActionCallbackOptions";
import {BodyRequiredError} from "./error/BodyRequiredError";
import {Driver} from "./driver/Driver";
import {ParamMetadata} from "./metadata/ParamMetadata";
import {ParamTypes} from "./metadata/types/ParamTypes";
import {ParameterParseJsonError} from "./error/ParameterParseJsonError";
import {ParameterRequiredError} from "./error/ParameterRequiredError";
import {plainToClass} from "class-transformer";

/**
 * Helps to handle parameters.
 */
export class ParamHandler {

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private driver: Driver) {
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    handleParam(actionOptions: ActionCallbackOptions, param: ParamMetadata): Promise<any> {

        const request = actionOptions.request;
        const response = actionOptions.response;
        
        if (param.type === ParamTypes.REQUEST)
            return Promise.resolve(request);

        if (param.type === ParamTypes.RESPONSE)
            return Promise.resolve(response);
        
        let value: any, originalValue: any;
        value = originalValue = this.driver.getParamFromRequest(actionOptions, param);
        
        const isValueEmpty = value === null || value === undefined || value === "";
        const isValueEmptyObject = value instanceof Object && Object.keys(value).length === 0;

        if (!isValueEmpty)
            value = this.handleParamFormat(value, param);
        
        // check cases when parameter is required but its empty and throw errors in such cases
        if (param.isRequired) {
            // todo: make better error messages here
            if (param.name && isValueEmpty) {
                return Promise.reject(new ParameterRequiredError(request.url, request.method, param.name));

            } else if (!param.name && (isValueEmpty || isValueEmptyObject)) {
                return Promise.reject(new BodyRequiredError(request.url, request.method));
            }
        }

        // if transform function is given for this param then apply it
        if (param.transform)
            value = param.transform(value, request, response);
        
        const promiseValue = value instanceof Promise ? value : Promise.resolve(value);
        return promiseValue.then((value: any) => {

            if (param.isRequired && originalValue !== null && originalValue !== undefined && isValueEmpty) {
                // TODO: handleResultOptions.errorHttpCode = 404; // maybe throw ErrorNotFoundError here?
                const contentType = param.reflectedType && param.reflectedType.name ? param.reflectedType.name : "content";
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
                if (value === "true") {
                    return true;
                    
                } else if (value === "false") {
                    return false;
                }
                return !!value;

            default:
                const isObjectFormat = format instanceof Function || formatName.toLowerCase() === "object";
                if (value && (param.parseJson || isObjectFormat))
                    value = this.parseValue(value, param);
        }
        return value;
    }

    private parseValue(value: any, paramMetadata: ParamMetadata) {
        try {
            const parseValue = typeof value === "string" ? JSON.parse(value) : value;
            // If value is already by instance of target class, then skip the plain to class step.
            if (!(value instanceof paramMetadata.format) && paramMetadata.format !== Object && paramMetadata.format && this.driver.useClassTransformer) {
                const options = paramMetadata.classTransformOptions || this.driver.plainToClassTransformOptions;
                return plainToClass(paramMetadata.format, parseValue, options);
            } else {
                return parseValue;
            }
        } catch (er) {
            // console.log(er);
            throw new ParameterParseJsonError(paramMetadata.name, value);
        }
    }


}