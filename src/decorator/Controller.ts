import { ControllerOptions } from "./../decorator-options/ControllerOptions";
import {getMetadataArgsStorage} from "../index";

/**
 * Defines a class as a controller.
 * Each decorated controller method is served as a controller action.
 * Controller actions are executed when request come.
 */
export function Controller(options?: ControllerOptions): Function {
    return function (object: Function) {
        getMetadataArgsStorage().controllers.push({
            type: "default",
            target: object,
            route: options ? options.baseRoute : undefined,
            subdomain: options ? options.subdomain : undefined,
        });
    };
}