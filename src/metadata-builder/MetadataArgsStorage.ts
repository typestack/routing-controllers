import {ControllerMetadataArgs} from "../metadata/args/ControllerMetadataArgs";
import {ActionMetadataArgs} from "../metadata/args/ActionMetadataArgs";
import {ParamMetadataArgs} from "../metadata/args/ParamMetadataArgs";
import {ResponseHandlerMetadataArgs} from "../metadata/args/ResponseHandleMetadataArgs";
import {MiddlewareMetadataArgs} from "../metadata/args/MiddlewareMetadataArgs";
import {UseMetadataArgs} from "../metadata/args/UseMetadataArgs";
import {UseInterceptorMetadataArgs} from "../metadata/args/UseInterceptorMetadataArgs";
import {InterceptorMetadataArgs} from "../metadata/args/InterceptorMetadataArgs";

/**
 * Storage all metadatas read from decorators.
 */
export class MetadataArgsStorage {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    controllers: ControllerMetadataArgs[] = [];
    middlewares: MiddlewareMetadataArgs[] = [];
    interceptors: InterceptorMetadataArgs[] = [];
    uses: UseMetadataArgs[] = [];
    useInterceptors: UseInterceptorMetadataArgs[] = [];
    actions: ActionMetadataArgs[] = [];
    params: ParamMetadataArgs[] = [];
    responseHandlers: ResponseHandlerMetadataArgs[] = [];

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    findMiddlewareMetadatasForClasses(classes: Function[]): MiddlewareMetadataArgs[] {
        return this.middlewares.filter(ctrl => {
            return classes.filter(cls => ctrl.target === cls).length > 0;
        });
    }

    findInterceptorMetadatasForClasses(classes: Function[]): InterceptorMetadataArgs[] {
        return this.interceptors.filter(ctrl => {
            return classes.filter(cls => ctrl.target === cls).length > 0;
        });
    }

    findControllerMetadatasForClasses(classes: Function[]): ControllerMetadataArgs[] {
        return this.controllers.filter(ctrl => {
            return classes.filter(cls => ctrl.target === cls).length > 0;
        });
    }

    findActionsWithTarget(target: Function): ActionMetadataArgs[] {
        return this.actions.filter(action => action.target === target);
    }

    findUsesWithTargetAndMethod(target: Function, methodName: string): UseMetadataArgs[] {
        return this.uses.filter(use => {
            return use.target === target && use.method === methodName;
        });
    }

    findUseInterceptorWithTargetAndMethod(target: Function, methodName: string): UseInterceptorMetadataArgs[] {
        return this.useInterceptors.filter(interceptor => {
            return interceptor.target === target && interceptor.method === methodName;
        });
    }

    findParamsWithTargetAndMethod(target: Function, methodName: string): ParamMetadataArgs[] {
        return this.params.filter(param => {
            return param.target === target && param.method === methodName;
        });
    }

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
        this.interceptors = [];
        this.uses = [];
        this.useInterceptors = [];
        this.actions = [];
        this.params = [];
        this.responseHandlers = [];
    }

}