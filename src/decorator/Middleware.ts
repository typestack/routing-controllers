import {defaultMetadataArgsStorage} from "../index";
import {MiddlewareMetadataArgs} from "../metadata/args/MiddlewareMetadataArgs";

/**
 * Marks given class as a middleware.
 * Allows to create global middlewares and control order of middleware execution.
 */
export function Middleware(options?: { type?: "after"|"before", global?: boolean, priority?: number }): Function {
    return function (target: Function) {
        const metadata: MiddlewareMetadataArgs = {
            target: target,
            global: options && options.global === true ? true : false,
            priority: options && options.priority !== undefined ? options.priority : undefined,
            type: options && options.type ? options.type : "before",
        };
        defaultMetadataArgsStorage().middlewares.push(metadata);
    };
}