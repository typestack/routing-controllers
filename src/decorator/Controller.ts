import {getMetadataArgsStorage} from "../index";

/**
 * Defines a class as a controller.
 * Each decorated controller method is served as a controller action.
 * Controller actions are executed on user request.
 * You can specify base route path to all controller actions.
 */
export function Controller(baseRoute?: string): Function {
    return function (object: Function) {
        getMetadataArgsStorage().controllers.push({
            type: "default",
            target: object,
            route: baseRoute
        });
    };
}