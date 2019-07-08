/**
 * Metadata used to store registered error handlers.
 */
export interface ErrorHandlerMetadataArgs {
  /**
   * Execution priority of the error handler.
   */
  priority: number;

  /**
   * Object class of the error handler class.
   */
  target: Function;
}
