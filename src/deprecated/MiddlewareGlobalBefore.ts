import {defaultMetadataArgsStorage} from "../index";
import {MiddlewareMetadataArgs} from "../metadata/args/MiddlewareMetadataArgs";
import {GlobalMiddlewareOptions} from "../decorator-options/GlobalMiddlewareOptions";

/**
 * Registers a global middleware that runs before the route actions.
 *
 * @deprecated use @Middleware({ type: "before", global: true }) instead
 */
export function MiddlewareGlobalBefore(options?: GlobalMiddlewareOptions): Function {
    return function (target: Function) {
        const metadata: MiddlewareMetadataArgs = {
            target: target,
            isGlobal: true,
            priority: options && options.priority ? options.priority : undefined,
            afterAction: false
        };
        defaultMetadataArgsStorage().middlewares.push(metadata);
    };
}