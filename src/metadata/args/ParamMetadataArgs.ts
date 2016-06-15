import {ParamTypes} from "../types/ParamTypes";

/**
 * Controller metadata used to storage information about registered parameters.
 */
export interface ParamMetadataArgs {

    /**
     * Parameter target.
     */
    target: any;

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
    type: ParamTypes;

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
    transform?: (value?: any, request?: any, response?: any) => Promise<any>|any;
}