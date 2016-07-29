import {ClassTransformOptions} from "class-transformer";

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

    /**
     * Class transform options used to perform plainToClass operation.
     */
    classTransformOptions?: ClassTransformOptions;
    
}