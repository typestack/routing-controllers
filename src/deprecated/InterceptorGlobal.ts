import {defaultMetadataArgsStorage} from "../index";
import {InterceptorMetadataArgs} from "../metadata/args/InterceptorMetadataArgs";

/**
 * Registers a global interceptor.
 *
 * @deprecated interceptor decorators are deprecated. Use middlewares instead.
 */
export function InterceptorGlobal(options?: { priority?: number }): Function {
    return function (target: Function) {
        const metadata: InterceptorMetadataArgs = {
            target: target,
            isGlobal: true,
            priority: options && options.priority ? options.priority : undefined
        };
        defaultMetadataArgsStorage().interceptors.push(metadata);
    };
}
