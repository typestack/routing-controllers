import {ControllerMetadata} from "../metadata/ControllerMetadata";
import {ActionMetadata} from "../metadata/ActionMetadata";
import {ParamMetadata} from "../metadata/ParamMetadata";
import {ResponseHandleMetadata} from "../metadata/ResponseHandleMetadata";
import {MiddlewareMetadata} from "../metadata/MiddlewareMetadata";

/**
 * Storage all metadatas read from decorators.
 */
export class MetadataStorage {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    controllerMetadatas: ControllerMetadata[] = [];
    middlewareMetadatas: MiddlewareMetadata[] = [];
    actionMetadatas: ActionMetadata[] = [];
    paramMetadatas: ParamMetadata[] = [];
    responseHandleMetadatas: ResponseHandleMetadata[] = [];

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    findControllerMetadatasForClasses(controllerClasses: Function[]): ControllerMetadata[] {
        return this.controllerMetadatas.filter(ctrl => {
            return controllerClasses.filter(cls => ctrl.object === cls).length > 0;
        });
    }

    findActionMetadatasForControllerMetadata(controllerMetadata: ControllerMetadata): ActionMetadata[] {
        return this.actionMetadatas.filter(action => action.object.constructor === controllerMetadata.object);
    }

    findParamMetadatasForControllerAndActionMetadata(controllerMetadata: ControllerMetadata, actionMetadata: ActionMetadata): ParamMetadata[] {
        return this.paramMetadatas.filter(param => {
            return param.object.constructor === controllerMetadata.object && param.method === actionMetadata.method;
        });
    }

    findResponsePropertyMetadatasForControllerAndActionMetadata(controllerMetadata: ControllerMetadata, actionMetadata: ActionMetadata): ResponseHandleMetadata[] {
        return this.responseHandleMetadatas.filter(property => {
            return property.object.constructor === controllerMetadata.object && property.method === actionMetadata.method;
        });
    }

}