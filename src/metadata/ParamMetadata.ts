/**
 * Controller metadata used to storage information about registered parameters.
 */
export interface ParamMetadata {

    /**
     * Object on which's method's parameter this parameter is attached.
     */
    object: any;

    /**
     * Method on which's parameter is attached.
     */
    method: string;

    /**
     * Index (# number) of the parameter in the method signature.
     */
    index: number;

    /**
     * Parameter type.
     */
    type: ParamType;

    /**
     * Parameter name.
     */
    name?: string;

    /**
     * Parameter format.
     */
    format?: any;

    /**
     * Specifies if parameter should be parsed as json or not.
     */
    parseJson: boolean;

    /**
     * Indicates if this parameter is required or not
     */
    isRequired: boolean;

    /**
     * Transforms the value.
     */
    transform?: (value: any) => Promise<any>|any;
}

/**
 * Action parameter types.
 */
export enum ParamType {
    BODY = 1,
    QUERY = 2,
    BODY_PARAM = 3,
    PARAM = 4,
    COOKIE = 5,
    REQUEST = 6,
    RESPONSE = 7,
    NEXT_FN = 8
}

/**
 * Extra parameters set to the parameter.
 */
export interface ParamOptions {

    /**
     * If set to true then parameter will be required.
     */
    required?: boolean;

    /**
     * If set to true then parameter will be parsed to json.
     */
    parseJson?: boolean;
}
