import { UseInterceptorMetadataArgs } from './args/UseInterceptorMetadataArgs';

/**
 * "Use interceptor" metadata.
 */
export class InterceptorMetadata {
  // -------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------

  /**
   * Object class of the interceptor class.
   */
  target: Function;

  /**
   * Method used by this "use".
   */
  method: string;

  /**
   * Interceptor class or function to be executed by this "use".
   */
  interceptor: Function;

  /**
   * Indicates if this interceptor is global or not.
   */
  global: boolean;

  /**
   * Interceptor priority. Used for global interceptors.
   */
  priority: number;

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
