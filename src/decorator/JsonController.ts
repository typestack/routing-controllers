import { ControllerOptions } from "./../decorator-options/ControllerOptions";
import {getMetadataArgsStorage} from "../index";

/**
 * Defines a class as a JSON controller. If JSON controller is used, then all controller actions will return
 * a serialized json data, and its response content-type always will be application/json.
 */
export function JsonController(options?: ControllerOptions) {
    return function (object: Function) {
        getMetadataArgsStorage().controllers.push({
            type: "json",
            target: object,
            route: options ? options.baseRoute : undefined,
            subdomain: options ? options.subdomain : undefined,
        });
    };
}
