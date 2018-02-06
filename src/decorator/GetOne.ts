import {getMetadataArgsStorage} from "../index";

/**
 * Gets one model by a criteria object.
 * Decorator is used only in the model controllers.
 */
export function GetOne() {
    return function(object: Object, propertyName: string) {

        getMetadataArgsStorage().actions.push({
            target: object.constructor,
            method: propertyName,
            type: "get-one",
        });
    };
}