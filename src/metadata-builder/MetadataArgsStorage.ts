import {ControllerMetadataArgs} from "../metadata/args/ControllerMetadataArgs";
import {ActionMetadataArgs} from "../metadata/args/ActionMetadataArgs";
import {ParamMetadataArgs} from "../metadata/args/ParamMetadataArgs";
import {ResponseHandlerMetadataArgs} from "../metadata/args/ResponseHandleMetadataArgs";
import {MiddlewareMetadataArgs} from "../metadata/args/MiddlewareMetadataArgs";
import {UseMetadataArgs} from "../metadata/args/UseMetadataArgs";

/**
 * Storage all metadatas read from decorators.
 */
export class MetadataArgsStorage {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    /**
     * Registered controller metadata args.
     */
    controllers: ControllerMetadataArgs[] = [];

    /**
     * Registered middleware metadata args.
     */
    middlewares: MiddlewareMetadataArgs[] = [];

    /**
     * Registered "use middleware" metadata args.
     */
    uses: UseMetadataArgs[] = [];

    /**
     * Registered action metadata args.
     */
    actions: ActionMetadataArgs[] = [];

    /**
     * Registered param metadata args.
     */
    params: ParamMetadataArgs[] = [];

    /**
     * Registered response handler metadata args.
     */
    responseHandlers: ResponseHandlerMetadataArgs[] = [];

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Filters registered middlewares by a given classes.
     */
    findMiddlewareMetadatasForClasses(classes: Function[]): MiddlewareMetadataArgs[] {
        return this.middlewares.filter(ctrl => {
            return classes.filter(cls => ctrl.target === cls).length > 0;
        });
    }

    /**
     * Filters registered controllers by a given classes.
     */
    findControllerMetadatasForClasses(classes: Function[]): ControllerMetadataArgs[] {
        return this.controllers.filter(ctrl => {
            return classes.filter(cls => ctrl.target === cls).length > 0;
        });
    }

    /**
     * Filters registered actions by a given classes.
     */
    findActionsWithTarget(target: Function): ActionMetadataArgs[] {
        return this.actions.filter(action => action.target === target);
    }

    /**
     * Filters registered "use middlewares" by a given target class and method name.
     */
    findUsesWithTargetAndMethod(target: Function, methodName: string): UseMetadataArgs[] {
        return this.uses.filter(use => {
            return use.target === target && use.method === methodName;
        });
    }

    /**
     * Filters parameters by a given classes.
     */
    findParamsWithTargetAndMethod(target: Function, methodName: string): ParamMetadataArgs[] {
        return this.params.filter(param => {
            return param.object.constructor === target && param.method === methodName;
        });
    }

    /**
     * Filters response handlers by a given class.
     */
    findResponseHandlersWithTarget(target: Function): ResponseHandlerMetadataArgs[] {
        return this.responseHandlers.filter(property => {
            return property.target === target;
        });
    }

    /**
     * Filters response handlers by a given classes.
     */
    findResponseHandlersWithTargetAndMethod(target: Function, methodName: string): ResponseHandlerMetadataArgs[] {
        return this.responseHandlers.filter(property => {
            return property.target === target && property.method === methodName;
        });
    }

    /**
     * Removes all saved metadata.
     */
    reset() {
        this.controllers = [];
        this.middlewares = [];
        this.uses = [];
        this.actions = [];
        this.params = [];
        this.responseHandlers = [];
    }

}