import {defaultMetadataArgsStorage} from "../index";
import {MiddlewareMetadataArgs} from "../metadata/args/MiddlewareMetadataArgs";
import {GlobalMiddlewareOptions} from "../metadata-options/GlobalMiddlewareOptions";

/**
 * Registers a global middleware that runs after the route actions.
 *
 * @deprecated use @Middleware({ type: "after", global: true }) instead
 */
export function MiddlewareGlobalAfter(options?: GlobalMiddlewareOptions): Function {
    return function (target: Function) {
        const metadata: MiddlewareMetadataArgs = {
            target: target,
            isGlobal: true,
            priority: options && options.priority ? options.priority : undefined,
            afterAction: true
        };
        defaultMetadataArgsStorage().middlewares.push(metadata);
    };
}
