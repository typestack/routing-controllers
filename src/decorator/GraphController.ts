import {getMetadataArgsStorage} from "../index";

/**
 * Marks class as graph controller.
 * Used for GraphQL controllers.
 */
export function GraphController() {
    return function (target: Function) {
        getMetadataArgsStorage().controllers.push({
            type: "graph",
            target: target
        });
    };
}