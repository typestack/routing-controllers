import { HttpError } from './HttpError';

/**
 * Exception for 401 HTTP error.
 */
export class UnauthorizedError extends HttpError {
  name = 'UnauthorizedError';

  constructor(message?: string) {
    super(401);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);

    if (message) this.message = message;
  }
}
