import {plainToClass} from "class-transformer";
import {ValidationError, validateOrReject as validate} from "class-validator";

import {ActionCallbackOptions} from "./ActionCallbackOptions";
import {BodyRequiredError} from "./error/BodyRequiredError";
import {BadRequestError} from "./http-error/BadRequestError";
import {Driver} from "./driver/Driver";
import {ParameterParseJsonError} from "./error/ParameterParseJsonError";
import {ParameterRequiredError} from "./error/ParameterRequiredError";
import {ParamMetadata} from "./metadata/ParamMetadata";
import {ParamTypes} from "./metadata/types/ParamTypes";

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

    private async parseValue(value: any, paramMetadata: ParamMetadata) {
        try {
            const valueObject = typeof value === "string" ? JSON.parse(value) : value;

            let parsedValue: any;
            // If value is already by instance of target class, then skip the plain to class step.
            if (!(value instanceof paramMetadata.format) && paramMetadata.format !== Object && paramMetadata.format && this.driver.useClassTransformer) {
                const options = paramMetadata.classTransformOptions || this.driver.plainToClassTransformOptions;
                parsedValue = plainToClass(paramMetadata.format, valueObject, options);
            } else {
                parsedValue = valueObject;
            }

            if (paramMetadata.validate || this.driver.enableValidation) {
                const options = paramMetadata.validationOptions || this.driver.validationOptions;
                return validate(parsedValue, options)
                    .then(() => parsedValue)
                    .catch((validationErrors: ValidationError[]) => {
                        const error: any = new BadRequestError(`Invalid ${paramMetadata.type}, check 'details' property for more info.`);
                        error.details = validationErrors;
                        throw error;
                    });
            } else {
                return parsedValue;
            }
        } catch (er) {
            throw new ParameterParseJsonError(paramMetadata.name, value);
        }
    }
}