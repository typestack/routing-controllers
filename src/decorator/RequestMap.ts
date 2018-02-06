import {getMetadataArgsStorage} from "../index";

/**
 * Registers a "request map" used in controller actions.
 */
export function RequestMap(name: string): Function {
    return function (target: Function) {
        getMetadataArgsStorage().requestMaps.push({
            target: target,
            name: name
        });
    };
}