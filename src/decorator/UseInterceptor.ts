import { getMetadataArgsStorage } from '../index';
import { Action } from '../Action';
import { UseInterceptorMetadataArgs } from '../metadata/args/UseInterceptorMetadataArgs';

/**
 * Specifies a given interceptor middleware or interceptor function, to which UseInterceptorMetadataArgs can be applied, to be used for controller or controller action. 
 * Must be set to controller action or controller class.
 */
export function UseInterceptor(
  optionsOrInterceptor: Partial<UseInterceptorMetadataArgs> | Function,
  ...interceptors: Array<Function>
): Function;


/**
 * Specifies a given interceptor middleware or interceptor function to be used for controller or controller action.
 * Must be set to controller action or controller class.
 */
export function UseInterceptor(...interceptors: Array<Function>): Function;

/**
 * Specifies a given interceptor middleware or interceptor function, to which UseInterceptorMetadataArgs can be applied, to be used for controller or controller action. 
 * Must be set to controller action or controller class.
 */
export function UseInterceptor(
  optionsOrInterceptor: Partial<UseInterceptorMetadataArgs> | ((action: Action, result: any) => any),
  ...interceptors: Array<(action: Action, result: any) => any>
): Function;

/**
 * Specifies a given interceptor middleware or interceptor function to be used for controller or controller action.
 * Must be set to controller action or controller class.
 */
export function UseInterceptor(...interceptors: Array<(action: Action, result: any) => any>): Function;

/**
 * Specifies a given interceptor middleware or interceptor function, to which UseInterceptorMetadataArgs can be applied, to be used for controller or controller action.
 * Must be set to controller action or controller class.
 */
export function UseInterceptor(
  optionsOrInterceptor: Partial<UseInterceptorMetadataArgs> | Function | ((action: Action, result: any) => any),
  ...interceptors: Array<Function | ((action: Action, result: any) => any)>
): Function {
  const optionsIsAnInterceptor = optionsOrInterceptor instanceof Function || Array.isArray(optionsOrInterceptor);
  const options: Partial<UseInterceptorMetadataArgs> = optionsIsAnInterceptor
    ? {}
    : (optionsOrInterceptor as Partial<UseInterceptorMetadataArgs>);
  return function (objectOrFunction: Object | Function, methodName?: string) {
    [...(optionsIsAnInterceptor ? [optionsOrInterceptor as Function] : []), ...interceptors].forEach(interceptor => {
      getMetadataArgsStorage().useInterceptors.push({
        ...options,
        interceptor: interceptor,
        target: methodName ? objectOrFunction.constructor : (objectOrFunction as Function),
        method: methodName,
        priority: options.priority ?? 0,
      });
    });
  };
}
