import {ControllerMetadataArgs} from "./ControllerMetadataArgs";
import {ActionMetadataArgs} from "./ActionMetadataArgs";
import {ParamMetadataArgs} from "./ParamMetadataArgs";
import {ResponseHandlerMetadataArgs} from "./ResponseHandleMetadataArgs";
import {MiddlewareMetadataArgs} from "./MiddlewareMetadataArgs";
import {UseMetadataArgs} from "./UseMetadataArgs";
import {UseInterceptorMetadataArgs} from "./UseInterceptorMetadataArgs";
import {InterceptorMetadataArgs} from "./InterceptorMetadataArgs";
import {ModelMetadataArgs} from "./ModelMetadataArgs";
import {ModelIdMetadataArgs} from "./ModelIdMetadataArgs";
import {RequestMapMetadataArgs} from "./RequestMapMetadataArgs";
import {ResolverMetadataArgs} from "./ResolverMetadataArgs";
import {GraphActionMetadataArgs} from "./GraphActionMetadataArgs";
import {ResolveMetadataArgs} from "./ResolveMetadataArgs";

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
     * Registered interceptor metadata args.
     */
    interceptors: InterceptorMetadataArgs[] = [];

    /**
     * Registered "use middleware" metadata args.
     */
    uses: UseMetadataArgs[] = [];

    /**
     * Registered "request map" metadata args.
     */
    requestMaps: RequestMapMetadataArgs[] = [];

    /**
     * Registered "model" metadata args.
     */
    models: ModelMetadataArgs[] = [];

    /**
     * Registered "model id" metadata args.
     */
    modelIds: ModelIdMetadataArgs[] = [];

    /**
     * Registered "use interceptor" metadata args.
     */
    useInterceptors: UseInterceptorMetadataArgs[] = [];

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

    /**
     * GraphQL actions - mutations and queries.
     */
    graphActions: GraphActionMetadataArgs[] = [];

    /**
     * Resolver metadata args.
     */
    resolvers: ResolverMetadataArgs[] = [];

    /**
     * Resolve metadata args.
     */
    resolves: ResolveMetadataArgs[] = [];

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Filters and returns only graph controllers.
     */
    filterGraphControllers(): ControllerMetadataArgs[] {
        return this.controllers.filter(controller => controller.type === "graph");
    }

    /**
     * Filters registered controllers by a given classes.
     */
    filterControllerMetadatasForClasses(classes: Function[]): ControllerMetadataArgs[] {
        return this.controllers.filter(ctrl => {
            return classes.filter(cls => ctrl.target === cls).length > 0;
        });
    }

    /**
     * Filters registered actions by a given classes.
     */
    filterActionsWithTarget(target: Function): ActionMetadataArgs[] {
        return this.actions.filter(action => action.target === target);
    }

    /**
     * Filters registered "use middlewares" by a given target class and method name.
     */
    filterUsesWithTargetAndMethod(target: Function, methodName: string): UseMetadataArgs[] {
        return this.uses.filter(use => {
            return use.target === target && use.method === methodName;
        });
    }

    /**
     * Filters registered "use interceptors" by a given target class and method name.
     */
    filterInterceptorUsesWithTargetAndMethod(target: Function, methodName: string): UseInterceptorMetadataArgs[] {
        return this.useInterceptors.filter(use => {
            return use.target === target && use.method === methodName;
        });
    }

    /**
     * Filters parameters by a given classes.
     */
    filterParamsWithTargetAndMethod(target: Function, methodName: string): ParamMetadataArgs[] {
        return this.params.filter(param => {
            return param.object.constructor === target && param.method === methodName;
        });
    }

    /**
     * Filters response handlers by a given class.
     */
    filterResponseHandlersWithTarget(target: Function): ResponseHandlerMetadataArgs[] {
        return this.responseHandlers.filter(property => {
            return property.target === target;
        });
    }

    /**
     * Filters response handlers by a given classes.
     */
    filterResponseHandlersWithTargetAndMethod(target: Function, methodName: string): ResponseHandlerMetadataArgs[] {
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
        this.requestMaps = [];
        this.models = [];
        this.modelIds = [];
        this.useInterceptors = [];
        this.actions = [];
        this.params = [];
        this.responseHandlers = [];
    }

}