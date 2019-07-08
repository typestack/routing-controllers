import {getMetadataArgsStorage} from '../index';
import {Action} from '../Action';

/**
 * Specifies a given interceptor middleware or interceptor function to be used for controller or controller action.
 * Must be set to controller action or controller class.
 */
export function UseInterceptor(...interceptors: Array<Function>): Function;

/**
 * Specifies a given interceptor middleware or interceptor function to be used for controller or controller action.
 * Must be set to controller action or controller class.
 */
export function UseInterceptor(...interceptors: Array<(action: Action, result: any) => any>): Function;

/**
 * Specifies a given interceptor middleware or interceptor function to be used for controller or controller action.
 * Must be set to controller action or controller class.
 */
export function UseInterceptor(...interceptors: Array<Function|((action: Action, result: any) => any)>): Function {
    return function(objectOrFunction: Object|Function, methodName?: string) {
        interceptors.forEach(interceptor => {
            getMetadataArgsStorage().useInterceptors.push({
                interceptor,
                target: methodName ? objectOrFunction.constructor : objectOrFunction as Function,
                method: methodName,
            });
        });
    };
}
