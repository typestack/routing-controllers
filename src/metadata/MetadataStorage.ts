import {ControllerMetadata} from "./ControllerMetadata";
import {ActionMetadata} from "./ActionMetadata";
import {ParamMetadata} from "./ParamMetadata";
import {ResponsePropertyMetadata} from "./ResponsePropertyMetadata";
import {ResponseInterceptorMetadata} from "./ResponseInterceptorMetadata";

/**
 * Storage all controllers metadata.
 */
export class MetadataStorage {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private _controllerMetadatas: ControllerMetadata[] = [];
    private _responseInterceptorMetadatas: ResponseInterceptorMetadata[] = [];
    private _actionMetadatas: ActionMetadata[] = [];
    private _paramMetadatas: ParamMetadata[] = [];
    private _responsePropertyMetadatas: ResponsePropertyMetadata[] = [];

    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------

    get controllerMetadatas(): ControllerMetadata[] {
        return this._controllerMetadatas;
    }

    get actionMetadatas(): ActionMetadata[] {
        return this._actionMetadatas;
    }

    get paramMetadatas(): ParamMetadata[] {
        return this._paramMetadatas;
    }

    get responsePropertyMetadatas(): ResponsePropertyMetadata[] {
        return this._responsePropertyMetadatas;
    }

    get responseInterceptorMetadatas(): ResponseInterceptorMetadata[] {
        return this._responseInterceptorMetadatas;
    }

    // -------------------------------------------------------------------------
    // Adder Methods
    // -------------------------------------------------------------------------

    addResponsePropertyMetadata(metadata: ResponsePropertyMetadata) {
        this._responsePropertyMetadatas.push(metadata);
    }

    addControllerMetadata(metadata: ControllerMetadata) {
        this._controllerMetadatas.push(metadata);
    }

    addResponseInterceptorMetadata(metadata: ResponseInterceptorMetadata) {
        this._responseInterceptorMetadatas.push(metadata);
    }

    addActionMetadata(metadata: ActionMetadata) {
        this._actionMetadatas.push(metadata);
    }

    addParamMetadata(metadata: ParamMetadata) {
        this._paramMetadatas.push(metadata);
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    findControllerMetadatasForClasses(controllerClasses: Function[]): ControllerMetadata[] {
        return this._controllerMetadatas.filter(ctrl => {
            return controllerClasses.filter(cls => ctrl.object === cls).length > 0;
        });
    }

    findActionMetadatasForControllerMetadata(controllerMetadata: ControllerMetadata): ActionMetadata[] {
        return this._actionMetadatas.filter(action => action.object.constructor === controllerMetadata.object);
    }

    findParamMetadatasForControllerAndActionMetadata(controllerMetadata: ControllerMetadata, actionMetadata: ActionMetadata): ParamMetadata[] {
        return this._paramMetadatas.filter(param => {
            return param.object.constructor === controllerMetadata.object && param.method === actionMetadata.method;
        });
    }

    findResponsePropertyMetadatasForControllerAndActionMetadata(controllerMetadata: ControllerMetadata, actionMetadata: ActionMetadata): ResponsePropertyMetadata[] {
        return this._responsePropertyMetadatas.filter(property => {
            return property.object.constructor === controllerMetadata.object && property.method === actionMetadata.method;
        });
    }

}

/**
 * Default metadata storage is used as singleton and can be used to storage all metadatas.
 */
export let defaultMetadataStorage = new MetadataStorage();