import {getMetadataArgsStorage} from "../index";

/**
 * Defines a class as a JSON controller. If JSON controller is used, then all controller actions will return
 * a serialized json data, and its response content-type always will be application/json.
 *
 * @param baseRoute Extra path you can apply as a base route to all controller actions
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
