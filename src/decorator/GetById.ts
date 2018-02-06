import {getMetadataArgsStorage} from "../index";

/**
 * Gets one model by requested id.
 * Decorator is used only in the model controllers.
 */
export function GetById() {
    return function(object: Object, propertyName: string) {

        getMetadataArgsStorage().actions.push({
            type: "get-by-id",
            target: object.constructor,
            method: propertyName,
        });
    };
}