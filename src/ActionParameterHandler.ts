import {plainToClass} from "class-transformer";
import {validateOrReject as validate, ValidationError} from "class-validator";
import {ActionProperties} from "./ActionProperties";
import {BodyRequiredError} from "./error/BodyRequiredError";
import {BadRequestError} from "./http-error/BadRequestError";
import {Driver} from "./driver/Driver";
import {ParameterParseJsonError} from "./error/ParameterParseJsonError";
import {ParameterRequiredError} from "./error/ParameterRequiredError";
import {ParamMetadata} from "./metadata/ParamMetadata";
import {NotFoundError} from "./http-error/NotFoundError";

/**
 * Helps to handle parameters.
 */
export class ActionParameterHandler {

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private driver: Driver) {
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    handleParam(actionProperties: ActionProperties, param: ParamMetadata): Promise<any>|any {

        if (param.type === "request")
            return actionProperties.request;

        if (param.type === "response")
            return actionProperties.response;
        
        let value: any, originalValue: any;
        value = originalValue = this.driver.getParamFromRequest(actionProperties, param);
        
        const isValueEmpty = value === null || value === undefined || value === "";
        const isValueEmptyObject = value instanceof Object && Object.keys(value).length === 0;

        if (!isValueEmpty)
            value = this.handleParamFormat(value, param);
        
        // check cases when parameter is required but its empty and throw errors in such cases
        if (param.required) {
            if (param.type === "body" && !param.name && (isValueEmpty || isValueEmptyObject)) { // body has a special check
                return Promise.reject(new BodyRequiredError(actionProperties));

            } else if (param.name && isValueEmpty) { // regular check for all other parameters
                return Promise.reject(new ParameterRequiredError(param, actionProperties));
            }
        }

        // if transform function is given for this param then apply it
        if (param.transform)
            value = param.transform(value, actionProperties.request, actionProperties.response);
        
        const promiseValue = value instanceof Promise ? value : Promise.resolve(value);
        return promiseValue.then((value: any) => {

            if (param.required && originalValue !== null && originalValue !== undefined && isValueEmpty) {
                const contentType = param.reflectedType && param.reflectedType.name ? param.reflectedType.name : "content";
                const message = param.name ? ` with ${param.name}='${originalValue}'` : ``;
                return Promise.reject(new NotFoundError(`Requested ${contentType + message} was not found`));
            }

            return value;
        });
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    protected handleParamFormat(value: any, param: ParamMetadata): any {
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
                if (value && (param.parse || isObjectFormat))
                    value = this.parseValue(value, param);
        }
        return value;
    }

    protected async parseValue(value: any, paramMetadata: ParamMetadata) {
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
                const options = paramMetadata.validateOptions || this.driver.validationOptions;
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