import {plainToClass} from "class-transformer";
import {validateOrReject as validate, ValidationError} from "class-validator";
import {ActionProperties} from "./ActionProperties";
import {BadRequestError} from "./http-error/BadRequestError";
import {Driver} from "./driver/Driver";
import {ParameterParseJsonError} from "./error/ParameterParseJsonError";
import {ParamMetadata} from "./metadata/ParamMetadata";
import {ParamRequiredError} from "./error/ParamRequiredError";

/**
 * Handles action parameter.
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

    /**
     * Handles action parameter.
     */
    handle(actionProperties: ActionProperties, param: ParamMetadata): Promise<any>|any {

        if (param.type === "request")
            return actionProperties.request;

        if (param.type === "response")
            return actionProperties.response;

        // get parameter value from request and normalize it
        const value = this.normalizeParamValue(this.driver.getParamFromRequest(actionProperties, param), param);

        // check cases when parameter is required but its empty and throw errors in this case
        if (param.required) {
            const isValueEmpty = value === null || value === undefined || value === "";
            const isValueEmptyObject = value instanceof Object && Object.keys(value).length === 0;

            if (param.type === "body" && !param.name && (isValueEmpty || isValueEmptyObject)) { // body has a special check and error message
                return Promise.reject(new ParamRequiredError(actionProperties, param));

            } else if (param.name && isValueEmpty) { // regular check for all other parameters // todo: figure out something with param.name usage and multiple things params (query params, upload files etc.)
                return Promise.reject(new ParamRequiredError(actionProperties, param));
            }
        }

        // if transform function is given for this param then apply it
        if (param.transform)
            return param.transform(actionProperties, value);

        return value;
    }

    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------

    /**
     * Normalizes parameter value.
     */
    protected normalizeParamValue(value: any, param: ParamMetadata): any {
        if (value === null || value === undefined)
            return value;

        switch (param.targetName) {
            case "number":
                if (value === "") return undefined;
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
                if (value && (param.parse || param.isTargetObject)) {
                    value = this.parseValue(value, param);
                    value = this.transformValue(value, param);
                    value = this.validateValue(value, param);
                }
        }
        return value;
    }

    /**
     * Parses string value into a JSON object.
     */
    protected parseValue(value: any, paramMetadata: ParamMetadata): any {
        if (typeof value === "string") {
            try {
                return JSON.parse(value);
            } catch (error) {
                throw new ParameterParseJsonError(paramMetadata.name, value);
            }
        }

        return value;
    }

    /**
     * Perform class-transformation if enabled.
     */
    protected transformValue(value: any, paramMetadata: ParamMetadata): any {
        if (this.driver.useClassTransformer &&
            paramMetadata.targetType &&
            paramMetadata.targetType !== Object &&
            !(value instanceof paramMetadata.targetType)) {

            const options = paramMetadata.classTransform || this.driver.plainToClassTransformOptions;
            value = plainToClass(paramMetadata.targetType, value, options);
        }

        return value;
    }

    /**
     * Perform class-validation if enabled.
     */
    protected validateValue(value: any, paramMetadata: ParamMetadata): Promise<any>|any {
        if (paramMetadata.validate || (this.driver.enableValidation && paramMetadata.validate !== false)) {
            const options = paramMetadata.validate instanceof Object ? paramMetadata.validate : this.driver.validationOptions;
            return validate(value, options)
                .then(() => value)
                .catch((validationErrors: ValidationError[]) => {
                    const error: any = new BadRequestError(`Invalid ${paramMetadata.type}, check 'errors' property for more info.`);
                    error.errors = validationErrors;
                    throw error;
                });
        }

        return value;
    }

}