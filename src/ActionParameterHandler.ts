import {plainToClass} from "class-transformer";
import {validateOrReject as validate, ValidationError} from "class-validator";
import {Action} from "./Action";
import {BadRequestError} from "./http-error/BadRequestError";
import {Driver} from "./driver/Driver";
import {ParameterParseJsonError} from "./error/ParameterParseJsonError";
import {ParamMetadata} from "./metadata/ParamMetadata";
import {ParamRequiredError} from "./error/ParamRequiredError";
import {AuthorizationRequiredError} from "./error/AuthorizationRequiredError";
import {CurrentUserCheckerNotDefinedError} from "./error/CurrentUserCheckerNotDefinedError";
import {isPromiseLike} from "./util/isPromiseLike";

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
    handle(action: Action, param: ParamMetadata): Promise<any>|any {

        if (param.type === "request")
            return action.request;

        if (param.type === "response")
            return action.response;

        if (param.type === "context")
            return action.context;

        // get parameter value from request and normalize it
        const value = this.normalizeParamValue(this.driver.getParamFromRequest(action, param), param);
        if (isPromiseLike(value))
            return value.then(value => this.handleValue(value, action, param));

        return this.handleValue(value, action, param);
    }

    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------

    /**
     * Handles non-promise value.
     */
    protected handleValue(value: any, action: Action, param: ParamMetadata): Promise<any>|any {

        // if transform function is given for this param then apply it
        if (param.transform)
            value = param.transform(action, value);

        // if its current-user decorator then get its value
        if (param.type === "current-user") {
            if (!this.driver.currentUserChecker)
                throw new CurrentUserCheckerNotDefinedError();

            value = this.driver.currentUserChecker(action);
        }

        // check cases when parameter is required but its empty and throw errors in this case
        if (param.required) {
            const isValueEmpty = value === null || value === undefined || value === "";
            const isValueEmptyObject = value instanceof Object && Object.keys(value).length === 0;

            if (param.type === "body" && !param.name && (isValueEmpty || isValueEmptyObject)) { // body has a special check and error message
                return Promise.reject(new ParamRequiredError(action, param));

            } else if (param.type === "current-user") { // current user has a special check as well

                if (isPromiseLike(value)) {
                    return value.then(currentUser => {
                        if (!currentUser)
                            return Promise.reject(new AuthorizationRequiredError(action));

                        return currentUser;
                    });

                } else {
                    if (!value)
                        return Promise.reject(new AuthorizationRequiredError(action));
                }

            } else if (param.name && isValueEmpty) { // regular check for all other parameters // todo: figure out something with param.name usage and multiple things params (query params, upload files etc.)
                return Promise.reject(new ParamRequiredError(action, param));
            }
        }

        return value;
    }

    /**
     * Normalizes parameter value.
     */
    protected normalizeParamValue(value: any, param: ParamMetadata): Promise<any>|any {
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
                    value = this.validateValue(value, param); // note this one can return promise
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