import {getMetadataArgsStorage} from "../index";

/**
 * Register save many and remove many action for the controller's model.
 * Decorator is used only in the model controllers.
 */
export function SaveAndRemove() {
    return function(object: Object, propertyName: string) {

        getMetadataArgsStorage().actions.push({
            target: object.constructor,
            method: propertyName,
            type: "save-and-remove",
        });
    };
}