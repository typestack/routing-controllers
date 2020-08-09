import { ValidatorOptions } from 'class-validator';
import { ClassTransformOptions } from 'class-transformer';

/**
 * Body decorator parameters.
 */
export interface BodyOptions {
  /**
   * If set to true then request body will become required.
   * If user performs a request and body is not in a request then routing-controllers will throw an error.
   */
  required?: boolean;

  /**
   * Class-transformer options used to perform plainToClass operation.
   *
   * @see https://github.com/pleerock/class-transformer
   */
  transform?: ClassTransformOptions;

  /**
   * If true, class-validator will be used to validate param object.
   * If validation options are given then class-validator will perform validation with given options.
   *
   * @see https://github.com/pleerock/class-validator
   */
  validate?: boolean | ValidatorOptions;

  /**
   * Extra options to be passed to body-parser middleware.
   */
  options?: any;

  /**
   * Explicitly set type which should be used for Body to perform transformation.
   */
  type?: any;
}
