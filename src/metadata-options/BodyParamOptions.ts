import {ValidatorOptions} from "class-validator";
import {ClassTransformOptions} from "class-transformer";

/**
 * Extra parameters set to the parameter.
 */
export interface BodyParamOptions {

    /**
     * If set to true then parameter will be required.
     */
    required?: boolean;

    /**
     * Class transform options used to perform plainToClass operation.
     */
    transform?: ClassTransformOptions;

    /**
     * If true, class-validator will be used to validate param object.
     * If validation options are given then class-validator will perform validation with given options.
     */
    validate?: boolean|ValidatorOptions;
    
}