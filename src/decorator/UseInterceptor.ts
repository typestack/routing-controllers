import { getMetadataArgsStorage } from '../index';
import { Action } from '../Action';
import { ClassConstructor } from 'class-transformer';
import { InterceptorInterface } from '../InterceptorInterface';
import { Newable, Callable } from '@rce/types/Types';

/**
 * Specifies a given interceptor middleware or interceptor function to be used for controller or controller action.
 * Must be set to controller action or controller class.
 */
export function UseInterceptor(...interceptors: Array<ClassConstructor<InterceptorInterface>>): Callable;

/**
 * Specifies a given interceptor middleware or interceptor function to be used for controller or controller action.
 * Must be set to controller action or controller class.
 */
export function UseInterceptor(...interceptors: Array<(action: Action, result: any) => any>): Callable;

/**
 * Specifies a given interceptor middleware or interceptor function to be used for controller or controller action.
 * Must be set to controller action or controller class.
 */
export function UseInterceptor(
  ...interceptors: Array<ClassConstructor<InterceptorInterface> | ((action: Action, result: any) => any)>
): Callable {
  return function (objectOrFunction: Newable | Callable, methodName?: string, priority?: number) {
    interceptors.forEach(interceptor => {
      getMetadataArgsStorage().useInterceptors.push({
        interceptor: interceptor,
        target: methodName ? objectOrFunction.constructor : (objectOrFunction as Callable),
        method: methodName,
        priority: priority ?? 0,
      });
    });
  };
}
