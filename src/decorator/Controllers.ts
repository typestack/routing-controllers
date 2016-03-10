import "reflect-metadata";
import {defaultMetadataStorage} from "./../metadata/MetadataStorage";
import {ActionType} from "./../metadata/ActionMetadata";
import {ResponsePropertyType} from "./../metadata/ResponsePropertyMetadata";
import {ControllerType} from "./../metadata/ControllerMetadata";
import {ParamType, ParamOptions} from "./../metadata/ParamMetadata";
import {ActionOptions} from "./../metadata/ActionMetadata";

/**
 * Defines a class as a controller. All methods with special decorators will be registered as controller actions.
 * Controller actions are executed when request to their routes comes.
 *
 * @param baseRoute Extra path you can apply as a base route to all controller actions
 */
export function Controller(baseRoute?: string) {
    return function (object: Function) {
        defaultMetadataStorage.addControllerMetadata({
            route: baseRoute,
            object: object,
            type: ControllerType.DEFAULT
        });
    };
}

/**
 * Defines a class as a JSON controller. If JSON controller is used, then all controller actions will return
 * a serialized json data, and its response content-type always will be application/json.
 *
 * @param baseRoute Extra path you can apply as a base route to all controller actions
 */
export function JsonController(baseRoute?: string) {
    return function (object: Function) {
        defaultMetadataStorage.addControllerMetadata({
            route: baseRoute,
            object: object,
            type: ControllerType.JSON
        });
    };
}