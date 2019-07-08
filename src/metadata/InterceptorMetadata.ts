import {UseInterceptorMetadataArgs} from './args/UseInterceptorMetadataArgs';

/**
 * "Use interceptor" metadata.
 */
export class InterceptorMetadata {
  /**
   * Indicates if this interceptor is global or not.
   */
  public global: boolean;

  /**
   * Interceptor class or function to be executed by this "use".
   */
  public interceptor: Function;

  /**
   * Method used by this "use".
   */
  public method: string;

  /**
   * Interceptor priority. Used for global interceptors.
   */
  public priority: number;

  // -------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------

  /**
   * Object class of the interceptor class.
   */
  public target: Function;

  // -------------------------------------------------------------------------
  // Constructor
  // -------------------------------------------------------------------------

  constructor(args: UseInterceptorMetadataArgs) {
    this.target = args.target;
    this.method = args.method;
    this.interceptor = args.interceptor;
    this.priority = args.priority;
    this.global = args.global;
  }
}
