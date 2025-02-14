import { Action } from '../Action';
import { UnauthorizedError } from '../http-error/UnauthorizedError';

/**
 * Thrown when authorization is required thought @CurrentUser decorator.
 */
export class AuthorizationRequiredError extends UnauthorizedError {
  name = 'AuthorizationRequiredError';

  constructor(action: Action) {
    super();
    Object.setPrototypeOf(this, AuthorizationRequiredError.prototype);
    const uri = `${action.request.method} ${action.request.url}`; // todo: check it it works in koa
    this.message = `Authorization is required for request on ${uri}`;
  }
}
