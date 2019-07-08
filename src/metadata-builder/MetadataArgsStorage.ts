import {ControllerMetadataArgs} from '../metadata/args/ControllerMetadataArgs';
import {ActionMetadataArgs} from '../metadata/args/ActionMetadataArgs';
import {ParamMetadataArgs} from '../metadata/args/ParamMetadataArgs';
import {ResponseHandlerMetadataArgs} from '../metadata/args/ResponseHandleMetadataArgs';
import {MiddlewareMetadataArgs} from '../metadata/args/MiddlewareMetadataArgs';
import {UseMetadataArgs} from '../metadata/args/UseMetadataArgs';
import {UseInterceptorMetadataArgs} from '../metadata/args/UseInterceptorMetadataArgs';
import {InterceptorMetadataArgs} from '../metadata/args/InterceptorMetadataArgs';

/**
 * Storage all metadatas read from decorators.
 */
export class MetadataArgsStorage {
  /**
   * Registered action metadata args.
   */
  public actions: Array<ActionMetadataArgs> = [];

  // -------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------

  /**
   * Registered controller metadata args.
   */
  public controllers: Array<ControllerMetadataArgs> = [];

  /**
   * Registered interceptor metadata args.
   */
  public interceptors: Array<InterceptorMetadataArgs> = [];

  /**
   * Registered middleware metadata args.
   */
  public middlewares: Array<MiddlewareMetadataArgs> = [];

  /**
   * Registered param metadata args.
   */
  public params: Array<ParamMetadataArgs> = [];

  /**
   * Registered response handler metadata args.
   */
  public responseHandlers: Array<ResponseHandlerMetadataArgs> = [];

  /**
   * Registered "use interceptor" metadata args.
   */
  public useInterceptors: Array<UseInterceptorMetadataArgs> = [];

  /**
   * Registered "use middleware" metadata args.
   */
  public uses: Array<UseMetadataArgs> = [];

  /**
   * Filters registered actions by a given classes.
   */
  public filterActionsWithTarget(target: Function): Array<ActionMetadataArgs> {
    return this.actions.filter(action => action.target === target);
  }

  /**
   * Filters registered controllers by a given classes.
   */
  public filterControllerMetadatasForClasses(classes: Array<Function>): Array<ControllerMetadataArgs> {
    return this.controllers.filter(ctrl => classes.filter(cls => ctrl.target === cls).length > 0);
  }

  /**
   * Filters registered interceptors by a given classes.
   */
  public filterInterceptorMetadatasForClasses(classes: Array<Function>): Array<InterceptorMetadataArgs> {
    return this.interceptors.filter(ctrl => classes.filter(cls => ctrl.target === cls).length > 0);
  }

  /**
   * Filters registered "use interceptors" by a given target class and method name.
   */
  public filterInterceptorUsesWithTargetAndMethod(
    target: Function,
    methodName: string,
  ): Array<UseInterceptorMetadataArgs> {
    return this.useInterceptors.filter(use => use.target === target && use.method === methodName);
  }

  // -------------------------------------------------------------------------
  // Public Methods
  // -------------------------------------------------------------------------

  /**
   * Filters registered middlewares by a given classes.
   */
  public filterMiddlewareMetadatasForClasses(classes: Array<Function>): Array<MiddlewareMetadataArgs> {
    return classes.map(cls => this.middlewares.find(mid => mid.target === cls)).filter(midd => midd !== undefined); // this might be not needed if all classes where decorated with `@Middleware`
  }

  /**
   * Filters parameters by a given classes.
   */
  public filterParamsWithTargetAndMethod(target: Function, methodName: string): Array<ParamMetadataArgs> {
    return this.params.filter(param => param.object.constructor === target && param.method === methodName);
  }

  /**
   * Filters response handlers by a given class.
   */
  public filterResponseHandlersWithTarget(target: Function): Array<ResponseHandlerMetadataArgs> {
    return this.responseHandlers.filter(property => property.target === target);
  }

  /**
   * Filters response handlers by a given classes.
   */
  public filterResponseHandlersWithTargetAndMethod(
    target: Function,
    methodName: string,
  ): Array<ResponseHandlerMetadataArgs> {
    return this.responseHandlers.filter(property => property.target === target && property.method === methodName);
  }

  /**
   * Filters registered "use middlewares" by a given target class and method name.
   */
  public filterUsesWithTargetAndMethod(target: Function, methodName: string): Array<UseMetadataArgs> {
    return this.uses.filter(use => use.target === target && use.method === methodName);
  }

  /**
   * Removes all saved metadata.
   */
  public reset() {
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
