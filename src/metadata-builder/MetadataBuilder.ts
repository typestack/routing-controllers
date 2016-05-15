import {defaultMetadataArgsStorage} from "../index";
import {ControllerMetadata} from "../metadata/ControllerMetadata";
import {ActionMetadata} from "../metadata/ActionMetadata";
import {ParamMetadata} from "../metadata/ParamMetadata";
import {ResponseHandlerMetadata} from "../metadata/ResponseHandleMetadata";
import {MiddlewareMetadata} from "../metadata/MiddlewareMetadata";
import {ErrorHandlerMetadata} from "../metadata/ErrorHandlerMetadata";

/**
 * Builds metadata from the given metadata arguments.
 */
export class MetadataBuilder {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    buildControllerMetadata(classes?: Function[]) {
        return this.createControllers(classes);
    }

    buildMiddlewareMetadata(classes?: Function[]) {
        return this.createMiddlewares(classes);
    }

    buildErrorHandlerMetadata(classes?: Function[]) {
        return this.createErrorHandlers(classes);
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    
    private createErrorHandlers(classes?: Function[]) {
        const storage = defaultMetadataArgsStorage();
        const errorHandlers = !classes ? storage.errorHandlers : storage.findErrorHandlerMetadatasForClasses(classes);
        return errorHandlers.map(errorHandlerArgs => {
            return new ErrorHandlerMetadata(errorHandlerArgs);
        });
    }
    
    private createMiddlewares(classes?: Function[]) {
        const storage = defaultMetadataArgsStorage();
        const middlewares = !classes ? storage.middlewares : storage.findMiddlewareMetadatasForClasses(classes);
        return middlewares.map(middlewareArgs => {
            return new MiddlewareMetadata(middlewareArgs);
        });
    }
    
    private createControllers(classes?: Function[]) {
        const storage = defaultMetadataArgsStorage();
        const controllers = !classes ? storage.controllers : storage.findControllerMetadatasForClasses(classes);
        return controllers.map(controllerArgs => {
            const controller = new ControllerMetadata(controllerArgs);
            controller.actions = this.createActions(controller);
            return controller;
        });
    }
    
    private createActions(controller: ControllerMetadata) {
        return defaultMetadataArgsStorage()
            .findActionsWithTarget(controller.target)
            .map(actionArgs => {
                const action = new ActionMetadata(controller, actionArgs);
                action.params = this.createParams(action);
                action.responseHandlers = this.createResponseHandlers(action);
                return action;
            });
    }
    
    private createParams(action: ActionMetadata) {
        return defaultMetadataArgsStorage()
            .findParamsWithTargetAndMethod(action.target, action.method)
            .map(actionArgs => new ParamMetadata(action, actionArgs));
    }

    private createResponseHandlers(action: ActionMetadata) {
        return defaultMetadataArgsStorage()
            .findResponseHandlersWithTargetAndMethod(action.target, action.method)
            .map(actionArgs => new ResponseHandlerMetadata(action, actionArgs));
    }

}