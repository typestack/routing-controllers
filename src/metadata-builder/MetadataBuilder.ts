import {ActionMetadata} from '../metadata/ActionMetadata';
import {ControllerMetadata} from '../metadata/ControllerMetadata';
import {InterceptorMetadata} from '../metadata/InterceptorMetadata';
import {MiddlewareMetadata} from '../metadata/MiddlewareMetadata';
import {ParamMetadata} from '../metadata/ParamMetadata';
import {ParamMetadataArgs} from '../metadata/args/ParamMetadataArgs';
import {ResponseHandlerMetadata} from '../metadata/ResponseHandleMetadata';
import {RoutingControllersOptions} from '../RoutingControllersOptions';
import {UseMetadata} from '../metadata/UseMetadata';
import {getMetadataArgsStorage} from '../index';

/**
 * Builds metadata from the given metadata arguments.
 */
export class MetadataBuilder {
  constructor(private options: RoutingControllersOptions) {}

  // -------------------------------------------------------------------------
  // Public Methods
  // -------------------------------------------------------------------------

  /**
   * Builds controller metadata from a registered controller metadata args.
   */
  public buildControllerMetadata(classes?: Array<Function>) {
    return this.createControllers(classes);
  }

  /**
   * Builds interceptor metadata from a registered interceptor metadata args.
   */
  public buildInterceptorMetadata(classes?: Array<Function>): Array<InterceptorMetadata> {
    return this.createInterceptors(classes);
  }

  /**
   * Builds middleware metadata from a registered middleware metadata args.
   */
  public buildMiddlewareMetadata(classes?: Array<Function>): Array<MiddlewareMetadata> {
    return this.createMiddlewares(classes);
  }

  /**
   * Creates use interceptors for actions.
   */
  protected createActionInterceptorUses(action: ActionMetadata): Array<InterceptorMetadata> {
    return getMetadataArgsStorage()
      .filterInterceptorUsesWithTargetAndMethod(action.target, action.method)
      .map(useArgs => new InterceptorMetadata(useArgs));
  }

  /**
   * Creates response handler metadatas for action.
   */
  protected createActionResponseHandlers(action: ActionMetadata): Array<ResponseHandlerMetadata> {
    return getMetadataArgsStorage()
      .filterResponseHandlersWithTargetAndMethod(action.target, action.method)
      .map(handlerArgs => new ResponseHandlerMetadata(handlerArgs));
  }

  /**
   * Creates action metadatas.
   */
  protected createActions(controller: ControllerMetadata): Array<ActionMetadata> {
    return getMetadataArgsStorage()
      .filterActionsWithTarget(controller.target)
      .map(actionArgs => {
        const action = new ActionMetadata(controller, actionArgs, this.options);
        action.params = this.createParams(action);
        action.uses = this.createActionUses(action);
        action.interceptors = this.createActionInterceptorUses(action);
        action.build(this.createActionResponseHandlers(action));
        return action;
      });
  }

  /**
   * Creates use metadatas for actions.
   */
  protected createActionUses(action: ActionMetadata): Array<UseMetadata> {
    return getMetadataArgsStorage()
      .filterUsesWithTargetAndMethod(action.target, action.method)
      .map(useArgs => new UseMetadata(useArgs));
  }

  /**
   * Creates use interceptors for controllers.
   */
  protected createControllerInterceptorUses(controller: ControllerMetadata): Array<InterceptorMetadata> {
    return getMetadataArgsStorage()
      .filterInterceptorUsesWithTargetAndMethod(controller.target, undefined)
      .map(useArgs => new InterceptorMetadata(useArgs));
  }

  /**
   * Creates response handler metadatas for controller.
   */
  protected createControllerResponseHandlers(controller: ControllerMetadata): Array<ResponseHandlerMetadata> {
    return getMetadataArgsStorage()
      .filterResponseHandlersWithTarget(controller.target)
      .map(handlerArgs => new ResponseHandlerMetadata(handlerArgs));
  }

  /**
   * Creates controller metadatas.
   */
  protected createControllers(classes?: Array<Function>): Array<ControllerMetadata> {
    const controllers = !classes
      ? getMetadataArgsStorage().controllers
      : getMetadataArgsStorage().filterControllerMetadatasForClasses(classes);
    return controllers.map(controllerArgs => {
      const controller = new ControllerMetadata(controllerArgs);
      controller.build(this.createControllerResponseHandlers(controller));
      controller.actions = this.createActions(controller);
      controller.uses = this.createControllerUses(controller);
      controller.interceptors = this.createControllerInterceptorUses(controller);
      return controller;
    });
  }

  /**
   * Creates use metadatas for controllers.
   */
  protected createControllerUses(controller: ControllerMetadata): Array<UseMetadata> {
    return getMetadataArgsStorage()
      .filterUsesWithTargetAndMethod(controller.target, undefined)
      .map(useArgs => new UseMetadata(useArgs));
  }

  /**
   * Creates interceptor metadatas.
   */
  protected createInterceptors(classes?: Array<Function>): Array<InterceptorMetadata> {
    const interceptors = !classes
      ? getMetadataArgsStorage().interceptors
      : getMetadataArgsStorage().filterInterceptorMetadatasForClasses(classes);
    return interceptors.map(
      interceptorArgs =>
        new InterceptorMetadata({
          target: interceptorArgs.target,
          method: undefined,
          interceptor: interceptorArgs.target,
        }),
    );
  }

  // -------------------------------------------------------------------------
  // Protected Methods
  // -------------------------------------------------------------------------

  /**
   * Creates middleware metadatas.
   */
  protected createMiddlewares(classes?: Array<Function>): Array<MiddlewareMetadata> {
    const middlewares = !classes
      ? getMetadataArgsStorage().middlewares
      : getMetadataArgsStorage().filterMiddlewareMetadatasForClasses(classes);
    return middlewares.map(middlewareArgs => new MiddlewareMetadata(middlewareArgs));
  }

  /**
   * Creates param metadatas.
   */
  protected createParams(action: ActionMetadata): Array<ParamMetadata> {
    return getMetadataArgsStorage()
      .filterParamsWithTargetAndMethod(action.target, action.method)
      .map(paramArgs => new ParamMetadata(action, this.decorateDefaultParamOptions(paramArgs)));
  }

  /**
   * Decorate paramArgs with default settings
   */
  private decorateDefaultParamOptions(paramArgs: ParamMetadataArgs) {
    const options = this.options.defaults && this.options.defaults.paramOptions;
    if (!options) {
      return paramArgs;
    }

    if (paramArgs.required === undefined) {
      paramArgs.required = options.required || false;
    }

    return paramArgs;
  }
}
