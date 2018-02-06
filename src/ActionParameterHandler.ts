import {plainToClass} from "class-transformer";
import {validateOrReject as validate, ValidationError} from "class-validator";
import {Action} from "./Action";
import {BadRequestError} from "./http-error/BadRequestError";
import {ParameterParseJsonError} from "./error/ParameterParseJsonError";
import {ParamMetadata} from "./metadata/ParamMetadata";
import {ParamRequiredError} from "./error/ParamRequiredError";
import * as cookie from "cookie";
import {Utils} from "./Utils";
import {TypeStackFramework} from "./TypeStackFramework";

/**
 * Handles action parameter.
 */
export class ActionParameterHandler {

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private framework: TypeStackFramework) {
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Handles each parameter in the given action.
     * Since parameter handling can return promises we return array of mixed values which can include promises,
     * and a flag which indicates if there is at least one promise in the handled values.
     */
    handle(action: Action): { values: (Promise<any>|any)[], hasPromises: boolean } {
        let hasPromises = false, values: (Promise<any>|any)[] = [];
        action.metadata.params
            .sort((param1, param2) => param1.index - param2.index)
            .forEach(param => {
                const parameterValue = this.handleParameter(action, param);
                values.push(parameterValue);
                if (Utils.isPromiseLike(parameterValue)) {
                    hasPromises = true;
                }
            });

        return { values, hasPromises };
    }

    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------

    /**
     * Handles a single action parameter.
     */
    protected handleParameter(action: Action, param: ParamMetadata): Promise<any>|any {

        if (param.type === "request")
            return action.request;

        if (param.type === "response")
            return action.response;

        // get parameter value from request and normalize it
        const value = this.normalizeParamValue(this.getParamFromRequest(action, param), param);
        if (Utils.isPromiseLike(value))
            return value.then(value => this.handleValue(value, action, param));

        return this.handleValue(value, action, param);
    }

    /**
     * Gets parameter from the request.
     */
    protected getParamFromRequest(action: Action, param: ParamMetadata): any {;
        switch (param.type) {
            case "body":
                return action.request.body;

            case "body-param":
                return action.request.body[param.name];

            case "param":
                return action.request.params[param.name];

            case "params":
                return action.request.params;

            case "session":
                if (param.name)
                    return action.request.session[param.name];

                return action.request.session;

            case "query":
                return action.request.query[param.name];

            case "queries":
                return action.request.query;

            case "header":
                return action.request.headers[param.name.toLowerCase()];

            case "headers":
                return action.request.headers;

            case "file":
                return action.request.file;

            case "files":
                return action.request.files;

            case "cookie":
                if (!action.request.headers["cookie"]) return;
                const cookies = cookie.parse(action.request.headers["cookie"] as any);
                return cookies[param.name];

            case "cookies":
                if (!action.request.headers["cookie"]) return {};
                return cookie.parse(action.request.headers["cookie"] as any);
        }
    }

    /**
     * Handles non-promise value.
     */
    protected handleValue(value: any, action: Action, param: ParamMetadata): Promise<any>|any {

        // if transform function is given for this param then apply it
        if (param.transform)
            value = param.transform(action, value);

        // check cases when parameter is required but its empty and throw errors in this case
        if (param.required) {
            const isValueEmpty = value === null || value === undefined || value === "";
            const isValueEmptyObject = value instanceof Object && Object.keys(value).length === 0;

            if (param.type === "body" && !param.name && (isValueEmpty || isValueEmptyObject)) { // body has a special check and error message
                return Promise.reject(new ParamRequiredError(action, param));

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
                if (value === "true" || value === "1") {
                    return true;

                } else if (value === "false" || value === "0") {
                    return false;
                }

                return !!value;

            case "date":
                const parsedDate = new Date(value);
                if (isNaN(parsedDate.getTime())) {
                    return Promise.reject(new BadRequestError(`${param.name} is invalid! It can't be parsed to date.`));
                }
                return parsedDate;

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
        if (this.framework.options.classTransformer !== false &&
            paramMetadata.targetType &&
            paramMetadata.targetType !== Object &&
            !(value instanceof paramMetadata.targetType)) {

            const options = paramMetadata.classTransform || this.framework.options.plainToClassTransformOptions;
            value = plainToClass(paramMetadata.targetType, value, options);
        }

        return value;
    }

    /**
     * Perform class-validation if enabled.
     */
    protected validateValue(value: any, paramMetadata: ParamMetadata): Promise<any>|any {
        const isValidationEnabled = (paramMetadata.validate instanceof Object || paramMetadata.validate === true) ||
            (this.framework.options.validation !== false && paramMetadata.validate !== false);
        const shouldValidate = paramMetadata.targetType &&
            (paramMetadata.targetType !== Object) &&
            (value instanceof paramMetadata.targetType);

        if (isValidationEnabled && shouldValidate) {
            const options = paramMetadata.validate instanceof Object ? paramMetadata.validate : (this.framework.options.validation instanceof Object ? this.framework.options.validation : undefined); // todo: simplify
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