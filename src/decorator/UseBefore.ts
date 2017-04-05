import {defaultMetadataArgsStorage} from "../index";
import {UseMetadataArgs} from "../metadata/args/UseMetadataArgs";

/**
 * Specifies a given middleware to be used for controller or controller action BEFORE the action executes.
 * Must be set to controller action or controller class.
 */
export function UseBefore(...middlewares: Array<Function>): Function;
export function UseBefore(...middlewares: Array<(context: any, next: () => Promise<any>) => Promise<any>>): Function;
export function UseBefore(...middlewares: Array<(request: any, response: any, next: Function) => any>): Function;
export function UseBefore(...middlewares: Array<Function|((request: any, response: any, next: Function) => any)>): Function {
    return function (objectOrFunction: Object|Function, methodName?: string) {
        middlewares.forEach(middleware => {
            const metadata: UseMetadataArgs = {
                middleware: middleware,
                target: methodName ? objectOrFunction.constructor : objectOrFunction as Function,
                method: methodName,
                afterAction: false
            };
            defaultMetadataArgsStorage().uses.push(metadata);
        });
    };
}
