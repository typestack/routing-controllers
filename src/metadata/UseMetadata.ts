import { UseMetadataArgs } from './args/UseMetadataArgs';

/**
 * "Use middleware" metadata.
 */
export class UseMetadata {
  // -------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------

  /**
   * Object class of the middleware class.
   */
  target: any;

  /**
   * Method used by this "use".
   */
  method: string;

  /**
   * Middleware to be executed by this "use".
   */
  middleware: any;

  /**
   * Indicates if middleware must be executed after routing action is executed.
   */
  afterAction: boolean;

  // -------------------------------------------------------------------------
  // Constructor
  // -------------------------------------------------------------------------

  constructor(args: UseMetadataArgs) {
    this.target = args.target;
    this.method = args.method;
    this.middleware = args.middleware;
    this.afterAction = args.afterAction;
  }
}
