import { UseInterceptorMetadataArgs } from './args/UseInterceptorMetadataArgs';
import { Newable, Callable } from '@rce/types/Types';

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
  target: Newable | Callable;

  /**
   * Method used by this "use".
   */
  method?: string;

  /**
   * Interceptor class or function to be executed by this "use".
   */
  interceptor: any; //ClassConstructor<InterceptorInterface> | ((action: Action, result: any) => any);

  /**
   * Indicates if this interceptor is global or not.
   */
  global?: boolean;

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
    this.priority = args.priority ?? 0;
    this.global = args.global;
  }
}
