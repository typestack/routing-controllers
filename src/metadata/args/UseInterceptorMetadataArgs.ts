import { ClassConstructor } from 'class-transformer';
import { InterceptorInterface } from '../../InterceptorInterface';
import { Action } from '@rce/Action';

/**
 * Metadata used to store registered intercept for a specific controller or controller action.
 */
export interface UseInterceptorMetadataArgs {
  /**
   * Controller class where this intercept was used.
   */
  target: any;

  /**
   * Controller method to which this intercept is applied.
   * If method is not given it means intercept is used on the controller.
   * Then intercept is applied to all controller's actions.
   */
  method?: string;

  /**
   * Interceptor class or a function to be executed.
   */
  interceptor: ClassConstructor<InterceptorInterface> | ((action: Action, result: any) => any);

  /**
   * Indicates if this interceptor is global, thous applied to all routes.
   */
  global?: boolean;

  /**
   * Execution priority of the interceptor.
   */
  priority: number;
}
