import { InternalServerError } from '../http-error/InternalServerError';

/**
 * Thrown when currentUserChecker function is not defined in routing-controllers options.
 */
export class CurrentUserCheckerNotDefinedError extends InternalServerError {
  name = 'CurrentUserCheckerNotDefinedError';

  constructor() {
    super(
      `Cannot use @CurrentUser decorator. Please define currentUserChecker function in routing-controllers action before using it.`
    );
    Object.setPrototypeOf(this, CurrentUserCheckerNotDefinedError.prototype);
  }
}
