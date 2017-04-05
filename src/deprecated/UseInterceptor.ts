import {defaultMetadataArgsStorage} from "../index";
import {UseInterceptorMetadataArgs} from "../metadata/args/UseInterceptorMetadataArgs";

/**
 * Specifies a given interceptor middleware or interceptor function to be used for controller or controller action.
 * Must be set to controller action or controller class.
 *
 * @deprecated interceptor decorators are deprecated. Use middlewares instead.
 */
export function UseInterceptor(...interceptors: Array<Function>): Function;
export function UseInterceptor(...interceptors: Array<(request: any, response: any, result: any) => any>): Function;
export function UseInterceptor(...interceptors: Array<Function|((request: any, response: any, result: any) => any)>): Function {
    return function (objectOrFunction: Object|Function, methodName?: string) {
        interceptors.forEach(interceptor => {
            const metadata: UseInterceptorMetadataArgs = {
                interceptor: interceptor,
                target: methodName ? objectOrFunction.constructor : objectOrFunction as Function,
                method: methodName
            };
            defaultMetadataArgsStorage().useInterceptors.push(metadata);
        });
    };
}
