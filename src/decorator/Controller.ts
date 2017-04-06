import {defaultMetadataArgsStorage} from "../index";
import {ControllerMetadataArgs} from "../metadata/args/ControllerMetadataArgs";

/**
 * Defines a class as a controller.
 * Each decorated controller method is served as a controller action.
 * Controller actions are executed when request come.
 */
export function Controller(baseRoute?: string): Function {
    return function (object: Function) {
        const metadata: ControllerMetadataArgs = {
            route: baseRoute,
            target: object,
            type: "default"
        };
        defaultMetadataArgsStorage().controllers.push(metadata);
    };
}