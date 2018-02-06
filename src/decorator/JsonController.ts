import {getMetadataArgsStorage} from "../index";

/**
 * Defines a class as a JSON controller.
 * All controller actions will return a serialized json data,
 * and its response content-type will always be application/json.
 * Controller actions are executed on user request.
 * You can specify base route path to all controller actions.
 */
export function JsonController(baseRoute?: string) {
    return function (object: Function) {
        getMetadataArgsStorage().controllers.push({
            type: "json",
            target: object,
            route: baseRoute
        });
    };
}
