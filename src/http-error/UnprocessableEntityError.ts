import { HttpError } from './HttpError';

/**
 * Exception for 422 HTTP error.
 */
export class UnprocessableEntityError extends HttpError {
  name = 'UnprocessableEntityError';

  constructor(message?: string) {
    super(422);
    Object.setPrototypeOf(this, UnprocessableEntityError.prototype);

    if (message) this.message = message;
  }
}
