import {ControllerMetadataArgs} from "../metadata/args/ControllerMetadataArgs";
import {ActionMetadataArgs} from "../metadata/args/ActionMetadataArgs";
import {ParamMetadataArgs} from "../metadata/args/ParamMetadataArgs";
import {ResponseHandlerMetadataArgs} from "../metadata/args/ResponseHandleMetadataArgs";
import {MiddlewareMetadataArgs} from "../metadata/args/MiddlewareMetadataArgs";

/**
 * Storage all metadatas read from decorators.
 */
export class MetadataArgsStorage {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    controllers: ControllerMetadataArgs[] = [];
    middlewares: MiddlewareMetadataArgs[] = [];
    actions: ActionMetadataArgs[] = [];
    params: ParamMetadataArgs[] = [];
    responseHandlers: ResponseHandlerMetadataArgs[] = [];

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    findMiddlewareMetadatasForClasses(controllerClasses: Function[]): MiddlewareMetadataArgs[] {
        return this.middlewares.filter(ctrl => {
            return controllerClasses.filter(cls => ctrl.target === cls).length > 0;
        });
    }

    findControllerMetadatasForClasses(controllerClasses: Function[]): ControllerMetadataArgs[] {
        return this.controllers.filter(ctrl => {
            return controllerClasses.filter(cls => ctrl.target === cls).length > 0;
        });
    }

    findActionsWithTarget(target: Function): ActionMetadataArgs[] {
        return this.actions.filter(action => action.target === target);
    }

    findParamsWithTargetAndMethod(target: Function, methodName: string): ParamMetadataArgs[] {
        return this.params.filter(param => {
            return param.object.constructor === target && param.method === methodName;
        });
    }

    findResponseHandlersWithTargetAndMethod(target: Function, methodName: string): ResponseHandlerMetadataArgs[] {
        return this.responseHandlers.filter(property => {
            return property.target === target && property.method === methodName;
        });
    }

}