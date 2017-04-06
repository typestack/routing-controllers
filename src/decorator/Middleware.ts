import {defaultMetadataArgsStorage} from "../index";
import {MiddlewareMetadataArgs} from "../metadata/args/MiddlewareMetadataArgs";

/**
 * Registers a new middleware.
 */
export function Middleware(options?: { type?: "after"|"before", global?: boolean, priority?: number }): Function {
    return function (target: Function) {
        const metadata: MiddlewareMetadataArgs = {
            target: target,
            isGlobal: options && options.global === true ? true : false,
            priority: options && options.priority !== undefined ? options.priority : undefined,
            afterAction: options && options.type === "after" ? true : false,
        };
        defaultMetadataArgsStorage().middlewares.push(metadata);
    };
}