import {ControllerMetadata} from "../metadata/ControllerMetadata";
import {ActionMetadata} from "../metadata/ActionMetadata";
import {ParamMetadata} from "../metadata/ParamMetadata";
import {ResponseHandlerMetadata} from "../metadata/ResponseHandleMetadata";
import {MiddlewareMetadata} from "../metadata/MiddlewareMetadata";
import {UseMetadata} from "../metadata/UseMetadata";
import {getMetadataArgsStorage} from "../index";

/**
 * Builds metadata from the given metadata arguments.
 */
export class MetadataBuilder {

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Builds controller metadata from a registered controller metadata args.
     */
    buildControllerMetadata(classes?: Function[]) {
        return this.createControllers(classes);
    }

    /**
     * Builds middleware metadata from a registered middleware metadata args.
     */
    buildMiddlewareMetadata(classes?: Function[]) {
        return this.createMiddlewares(classes);
    }

    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------

    /**
     * Creates middleware metadatas.
     */
    protected createMiddlewares(classes?: Function[]): MiddlewareMetadata[] {
        const middlewares = !classes ? getMetadataArgsStorage().middlewares : getMetadataArgsStorage().findMiddlewareMetadatasForClasses(classes);
        return middlewares.map(middlewareArgs => new MiddlewareMetadata(middlewareArgs));
    }

    /**
     * Creates controller metadatas.
     */
    protected createControllers(classes?: Function[]): ControllerMetadata[] {
        const controllers = !classes ? getMetadataArgsStorage().controllers : getMetadataArgsStorage().findControllerMetadatasForClasses(classes);
        return controllers.map(controllerArgs => {
            const controller = new ControllerMetadata(controllerArgs);
            controller.actions = this.createActions(controller);
            controller.uses = this.createControllerUses(controller);
            return controller;
        });
    }

    /**
     * Creates action metadatas.
     */
    protected createActions(controller: ControllerMetadata): ActionMetadata[] {
        return getMetadataArgsStorage()
            .findActionsWithTarget(controller.target)
            .map(actionArgs => {
                const action = new ActionMetadata(controller, actionArgs);
                action.params = this.createParams(action);
                action.responseHandlers = this.createResponseHandlers(action);
                action.uses = this.createActionUses(action);
                action.build();
                return action;
            });
    }

    /**
     * Creates param metadatas.
     */
    protected createParams(action: ActionMetadata): ParamMetadata[] {
        return getMetadataArgsStorage()
            .findParamsWithTargetAndMethod(action.target, action.method)
            .map(paramArgs => new ParamMetadata(action, paramArgs));
    }

    /**
     * Creates response handler metadatas.
     */
    protected createResponseHandlers(action: ActionMetadata): ResponseHandlerMetadata[] {
        return getMetadataArgsStorage()
            .findResponseHandlersWithTargetAndMethod(action.target, action.method)
            .map(handlerArgs => new ResponseHandlerMetadata(action, handlerArgs));
    }

    /**
     * Creates use metadatas for actions.
     */
    protected createActionUses(action: ActionMetadata): UseMetadata[] {
        return getMetadataArgsStorage()
            .findUsesWithTargetAndMethod(action.target, action.method)
            .map(useArgs => new UseMetadata(useArgs));
    }

    /**
     * Creates use metadatas for controllers.
     */
    protected createControllerUses(controller: ControllerMetadata): UseMetadata[] {
        return getMetadataArgsStorage()
            .findUsesWithTargetAndMethod(controller.target, undefined)
            .map(useArgs => new UseMetadata(useArgs));
    }

}
