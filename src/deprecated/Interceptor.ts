import {defaultMetadataArgsStorage} from "../index";
import {InterceptorMetadataArgs} from "../metadata/args/InterceptorMetadataArgs";

/**
 * Registers a new interceptor.
 *
 * @deprecated Interceptor functionality is deprecated. Use middlewares instead.
 */
export function Interceptor(): Function {
    return function (target: Function) {
        const metadata: InterceptorMetadataArgs = {
            target: target,
            isGlobal: false,
            priority: undefined
        };
        defaultMetadataArgsStorage().interceptors.push(metadata);
    };
}
