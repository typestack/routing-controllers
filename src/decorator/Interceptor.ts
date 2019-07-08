import {getMetadataArgsStorage} from '../index';

/**
 * Registers a global interceptor.
 */
export function Interceptor(options?: { priority?: number }): Function {
    return function(target: Function) {
        getMetadataArgsStorage().interceptors.push({
            target,
            global: true,
            priority: options && options.priority ? options.priority : 0,
        });
    };
}
