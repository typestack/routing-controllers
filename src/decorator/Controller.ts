import {defaultMetadataArgsStorage} from "../index";
import {ControllerMetadataArgs} from "../metadata/args/ControllerMetadataArgs";

/**
 * Defines a class as a controller. All methods with special decorators will be registered as controller actions.
 * Controller actions are executed when request to their routes comes.
 *
 * @param baseRoute Extra path you can apply as a base route to all controller actions
 */
export function Controller(baseRoute?: string) {
    return function (object: Function) {
        const metadata: ControllerMetadataArgs = {
            route: baseRoute,
            target: object,
            type: "default"
        };
        defaultMetadataArgsStorage().controllers.push(metadata);
    };
}