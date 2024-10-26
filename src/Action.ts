/**
 * Controller action properties.
 */
export interface Action<TRequest = any, TResponse = any, TContext = any, TNext extends Function = Function> {
  /**
   * Action Request object.
   */
  request: TRequest;

  /**
   * Action Response object.
   */
  response: TResponse;

  /**
   * Content in which action is executed.
   * Koa-specific property.
   */
  context?: TContext;

  /**
   * "Next" function used to call next middleware.
   */
  next?: TNext;
}
