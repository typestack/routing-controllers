import {defaultMetadataArgsStorage} from "../index";
import {MiddlewareMetadataArgs} from "../metadata/args/MiddlewareMetadataArgs";

/**
 * Registers a new middleware.
 */
export function Middleware(): Function {
    return function (target: Function) {
        const metadata: MiddlewareMetadataArgs = {
            target: target,
            isGlobal: false,
            priority: undefined,
            afterAction: false
        };
        defaultMetadataArgsStorage().middlewares.push(metadata);
    };
}