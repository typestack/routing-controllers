import {HttpError} from './HttpError';

/**
 * Exception for 403 HTTP error.
 */
export class ForbiddenError extends HttpError {
  public name = 'ForbiddenError';

  constructor(message?: string) {
    super(403);
    Object.setPrototypeOf(this, ForbiddenError.prototype);

    if (message) {
      this.message = message;
    }
  }
}
