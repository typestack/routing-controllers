import {TransformValdiationOptions} from "class-transformer-validator";
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

    /**
     * If true, class-transformer-validator will be used to validate param object.
     */
    validate?: boolean;

    /**
     * Class-transformer-validator options used to transform and validate param object.
     */
    validatorOptions?: TransformValdiationOptions;
    
}