import {getMetadataArgsStorage} from "../index";

/**
 * Marks class as resolver.
 */
export function Resolver(name: Function|string) {
    return function (target: Function) {
        getMetadataArgsStorage().resolvers.push({
            target: target,
            name: name instanceof Function ? name.name : name
        });
    };
}