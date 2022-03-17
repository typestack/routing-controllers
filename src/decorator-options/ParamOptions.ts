import { ValidatorOptions } from "@nest/class-validator";
import { ClassTransformOptions } from "@nest/class-transformer";

/**
 * Extra options set to the parameter decorators.
 */
export interface ParamOptions {
  /**
   * If set to true then parameter will be required.
   * If user performs a request and required parameter is not in a request then routing-controllers will throw an error.
   */
  required?: boolean;

  /**
   * If set to true then parameter will be parsed to json.
   * Parsing is automatically done if parameter type is a class type.
   */
  parse?: boolean;

  /**
   * Class transform options used to perform plainToClass operation.
   */
  transform?: ClassTransformOptions;

  /**
   * If true, class-validator will be used to validate param object.
   * If validation options are given then class-validator will perform validation with given options.
   */
  validate?: boolean | ValidatorOptions;

  /**
   * Explicitly set type which should be used for param to perform transformation.
   */
  type?: any;
}
