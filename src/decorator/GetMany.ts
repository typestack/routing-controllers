import {getMetadataArgsStorage} from "../index";

/**
 * Gets array of models.
 * If criteria is given then models are given for the given criteria.
 * Decorator is used only in the model controllers.
 */
export function GetMany() {
    return function(object: Object, propertyName: string) {

        getMetadataArgsStorage().actions.push({
            target: object.constructor,
            method: propertyName,
            type: "get-many",
        });
    };
}