import {getMetadataArgsStorage} from "../index";

/**
 * Register save action for the controller's model.
 * Criteria can be used to perform conditional save.
 * Decorator is used only in the model controllers.
 */
export function Save() {
    return function(object: Object, propertyName: string) {
        getMetadataArgsStorage().actions.push({
            target: object.constructor,
            method: propertyName,
            type: "save",
        });

    };
}