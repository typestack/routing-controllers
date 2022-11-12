import { Newable, Callable } from '../../types/Types';

/**
 * Metadata used to store registered error handlers.
 */
export interface ErrorHandlerMetadataArgs {
  /**
   * Object class of the error handler class.
   */
  target: Newable | Callable;

  /**
   * Execution priority of the error handler.
   */
  priority: number;
}
