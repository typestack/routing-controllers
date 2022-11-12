import { Newable } from '../../types/Types';

/**
 * Metadata used to store registered middlewares.
 */
export interface MiddlewareMetadataArgs {
  /**
   * Object class of the middleware class.
   */
  target: Newable;

  /**
   * Indicates if this middleware is global, thous applied to all routes.
   */
  global: boolean;

  /**
   * Execution priority of the middleware.
   */
  priority: number;

  /**
   * Indicates if middleware must be executed after routing action is executed.
   */
  type: 'before' | 'after';
}
