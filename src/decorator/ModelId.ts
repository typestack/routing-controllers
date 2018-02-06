import {getMetadataArgsStorage} from "../index";

/**
 * Registers model's property as a model id.
 */
export function ModelId() {
    return function(object: Object, propertyName: string) {

        getMetadataArgsStorage().modelIds.push({
            target: object.constructor,
            propertyName: propertyName
        });
    };
}