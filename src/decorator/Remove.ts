import {getMetadataArgsStorage} from "../index";

/**
 * Register remove action for the controller's model.
 * Criteria can be used to perform conditional remove.
 * Decorator is used only in the model controllers.
 */
export function Remove() {
    return function(object: Object, propertyName: string) {

        getMetadataArgsStorage().actions.push({
            target: object.constructor,
            method: propertyName,
            type: "remove",
        });
    };
}