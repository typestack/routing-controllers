import {ValidatorOptions} from "class-validator";
import {ClassTransformOptions} from "class-transformer";
import {ParamType} from "../types/ParamType";

/**
 * Controller metadata used to storage information about registered parameters.
 */
export interface ParamMetadataArgs {

    /**
     * Parameter object.
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
     * Specifies if parameter should be parsed as json or not.
     */
    parse: boolean;

    /**
     * Indicates if this parameter is required or not
     */
    required: boolean;

    /**
     * Transforms the value.
     */
    transform?: (value?: any, request?: any, response?: any) => Promise<any>|any;
    
    /**
     * Extra parameter options.
     */
    extraOptions?: any;

    /**
     * Class transform options used to perform plainToClass operation.
     */
    classTransform?: ClassTransformOptions;

    /**
     * If true, class-validator will be used to validate param object.
     * If validation options are given then it means validation will be applied (is true).
     */
    validate?: boolean|ValidatorOptions;

    /**
     * Explicitly set type which should be used for Body to perform transformation.
     */
    explicitType?: any;

}