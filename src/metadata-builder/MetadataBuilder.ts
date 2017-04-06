import {defaultMetadataArgsStorage} from "../index";
import {ControllerMetadata} from "../metadata/ControllerMetadata";
import {ActionMetadata} from "../metadata/ActionMetadata";
import {ParamMetadata} from "../metadata/ParamMetadata";
import {ResponseHandlerMetadata} from "../metadata/ResponseHandleMetadata";
import {MiddlewareMetadata} from "../metadata/MiddlewareMetadata";
import {UseMetadata} from "../metadata/UseMetadata";

/**
 * Builds metadata from the given metadata arguments.
 */
export class MetadataBuilder {

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    buildControllerMetadata(classes?: Function[]) {
        return this.createControllers(classes);
    }

    buildMiddlewareMetadata(classes?: Function[]) {
        return this.createMiddlewares(classes);
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    private createMiddlewares(classes?: Function[]): MiddlewareMetadata[] {
        const storage = defaultMetadataArgsStorage();
        const middlewares = !classes ? storage.middlewares : storage.findMiddlewareMetadatasForClasses(classes);
        return middlewares.map(middlewareArgs => new MiddlewareMetadata(middlewareArgs));
    }
    
    private createControllers(classes?: Function[]): ControllerMetadata[] {
        const storage = defaultMetadataArgsStorage();
        const controllers = !classes ? storage.controllers : storage.findControllerMetadatasForClasses(classes);
        return controllers.map(controllerArgs => {
            const controller = new ControllerMetadata(controllerArgs);
            controller.actions = this.createActions(controller);
            controller.uses = this.createControllerUses(controller);
            return controller;
        });
    }
    
    private createActions(controller: ControllerMetadata): ActionMetadata[] {
        return defaultMetadataArgsStorage()
            .findActionsWithTarget(controller.target)
            .map(actionArgs => {
                const action = new ActionMetadata(controller, actionArgs);
                action.params = this.createParams(action);
                action.responseHandlers = this.createResponseHandlers(action);
                action.uses = this.createActionUses(action);
                return action;
            });
    }
    
    private createParams(action: ActionMetadata): ParamMetadata[] {
        return defaultMetadataArgsStorage()
            .findParamsWithTargetAndMethod(action.target, action.method)
            .map(paramArgs => new ParamMetadata(action, paramArgs));
    }

    private createResponseHandlers(action: ActionMetadata): ResponseHandlerMetadata[] {
        return defaultMetadataArgsStorage()
            .findResponseHandlersWithTargetAndMethod(action.target, action.method)
            .map(handlerArgs => new ResponseHandlerMetadata(action, handlerArgs));
    }

    private createActionUses(action: ActionMetadata): UseMetadata[] {
        return defaultMetadataArgsStorage()
            .findUsesWithTargetAndMethod(action.target, action.method)
            .map(useArgs => new UseMetadata(useArgs));
    }

    private createControllerUses(controller: ControllerMetadata): UseMetadata[] {
        return defaultMetadataArgsStorage()
            .findUsesWithTargetAndMethod(controller.target, undefined)
            .map(useArgs => new UseMetadata(useArgs));
    }

}