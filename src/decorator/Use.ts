import {getMetadataArgsStorage} from "../index";

/**
 * Specifies a given middleware to be used for controller or controller action BEFORE the action executes.
 * Must be set to controller action or controller class.
 */
export function Use(...middlewares: Array<Function>): Function;

/**
 * Specifies a given middleware to be used for controller or controller action BEFORE the action executes.
 * Must be set to controller action or controller class.
 */
export function Use(...middlewares: Array<(request: any, response: any, next: Function) => any>): Function;

/**
 * Specifies a given middleware to be used for controller or controller action BEFORE the action executes.
 * Must be set to controller action or controller class.
 */
export function Use(...middlewares: Array<Function|((request: any, response: any, next: Function) => any)>): Function {
    return function (objectOrFunction: Object|Function, methodName?: string) {
        middlewares.forEach(middleware => {
            getMetadataArgsStorage().uses.push({
                target: methodName ? objectOrFunction.constructor : objectOrFunction as Function,
                method: methodName,
                middleware: middleware,
                afterAction: false
            });
        });
    };
}
