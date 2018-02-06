import {getMetadataArgsStorage} from "../index";

/**
 * Registers a model with a given name.
 */
export function Model(name: string) {
    return function(target: Function) {

        getMetadataArgsStorage().models.push({
            target: target,
            name: name
        });
    };
}