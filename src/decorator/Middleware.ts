import {defaultMetadataArgsStorage} from "../metadata-builder/MetadataArgsStorage";

/**
 * Marks given class as a middleware.
 * Allows to create global middlewares and control order of middleware execution.
 */
export function Middleware(options: { type: "after"|"before", priority?: number }): Function {
    return function (target: Function) {
        defaultMetadataArgsStorage.middlewares.push({
            target: target,
            type: options && options.type ? options.type : "before",
            global: true,
            priority: options && options.priority !== undefined ? options.priority : undefined
        });
    };
}