import { MiddlewareMetadataArgs } from './args/MiddlewareMetadataArgs';

/**
 * Middleware metadata.
 */
export class MiddlewareMetadata {
  // -------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------

  /**
   * Indicates if this middleware is global, thous applied to all routes.
   */
  global: boolean;

  /**
   * Object class of the middleware class.
   */
  target: Function;

  /**
   * Execution priority of the middleware.
   */
  priority: number;

  /**
   * Indicates if middleware must be executed after routing action is executed.
   */
  type: 'before' | 'after';

  // -------------------------------------------------------------------------
  // Constructor
  // -------------------------------------------------------------------------

  constructor(args: MiddlewareMetadataArgs) {
    this.global = args.global;
    this.target = args.target;
    this.priority = args.priority;
    this.type = args.type;
  }
}
