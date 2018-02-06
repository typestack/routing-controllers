import {getMetadataArgsStorage} from "../index";

/**
 * Registers controller that handle requests to the given model.
 */
export function ModelController(model: Function) {
    return function(target: Function) {

        getMetadataArgsStorage().controllers.push({
            type: "model",
            target: target,
            model: model
        });
    };
}