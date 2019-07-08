import {Action} from '../Action';
import {ActionMetadataArgs} from './args/ActionMetadataArgs';
import {ActionType} from './types/ActionType';
import {ClassTransformOptions} from 'class-transformer';
import {ControllerMetadata} from './ControllerMetadata';
import {InterceptorMetadata} from './InterceptorMetadata';
import {ParamMetadata} from './ParamMetadata';
import {ResponseHandlerMetadata} from './ResponseHandleMetadata';
import {RoutingControllersOptions} from '../RoutingControllersOptions';
import {UseMetadata} from './UseMetadata';

/**
 * Action metadata.
 */
export class ActionMetadata {
  // -------------------------------------------------------------------------
  // Static Methods
  // -------------------------------------------------------------------------

  /**
   * Appends base route to a given regexp route.
   */
  public static appendBaseRoute(baseRoute: string, route: RegExp | string) {
    const prefix = `${baseRoute.length > 0 && baseRoute.indexOf('/') < 0 ? '/' : ''}${baseRoute}`;
    if (typeof route === 'string') {
      return `${prefix}${route}`;
    }

    if (!baseRoute || baseRoute === '') {
      return route;
    }

    const fullPath = `^${prefix}${route.toString().substr(1)}?$`;

    return new RegExp(fullPath, route.flags);
  }

  /**
   * Params to be appended to the method call.
   */
  public appendParams?: (action: Action) => Array<any>;

  /**
   * Roles set by @Authorized decorator.
   */
  public authorizedRoles: Array<any>;

  /**
   * Extra options used by @Body decorator.
   */
  public bodyExtraOptions: any;

  // -------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------

  /**
   * Action's controller.
   */
  public controllerMetadata: ControllerMetadata;

  /**
   * Full route to this action (includes controller base route).
   */
  public fullRoute: string | RegExp;

  /**
   * Response headers to be set.
   */
  public headers: {[name: string]: any};

  /**
   * Action's use interceptors.
   */
  public interceptors: Array<InterceptorMetadata>;

  /**
   * Indicates if this action uses Authorized decorator.
   */
  public isAuthorizedUsed: boolean;

  /**
   * Indicates if this action uses Body.
   */
  public isBodyUsed: boolean;

  /**
   * Indicates if this action uses Uploaded Files.
   */
  public isFilesUsed: boolean;

  /**
   * Indicates if this action uses Uploaded File.
   */
  public isFileUsed: boolean;

  /**
   * Indicates if controller of this action is json-typed.
   */
  public isJsonTyped: boolean;

  /**
   * Object's method that will be executed on this action.
   */
  public method: string;

  /**
   * Special function that will be called instead of orignal method of the target.
   */
  public methodOverride?: (actionMetadata: ActionMetadata, action: Action, params: Array<any>) => Promise<any> | any;

  /**
   * Http code to be used on null action returned content.
   */
  public nullResultCode: number | Function;

  /**
   * Action's parameters.
   */
  public params: Array<ParamMetadata>;

  /**
   * Specifies redirection url for this action.
   */
  public redirect: string;

  /**
   * Rendered template to be used for this controller action.
   */
  public renderedTemplate: string;

  /**
   * Class-transformer options for the action response content.
   */
  public responseClassTransformOptions: ClassTransformOptions;

  /**
   * Route to be registered for the action.
   */
  public route: string | RegExp;

  /**
   * Http code to be set on successful response.
   */
  public successHttpCode: number;

  /**
   * Class on which's method this action is attached.
   */
  public target: Function;

  /**
   * Action type represents http method used for the registered route. Can be one of the value defined in ActionTypes
   * class.
   */
  public type: ActionType;

  /**
   * Http code to be used on undefined action returned content.
   */
  public undefinedResultCode: number | Function;

  /**
   * Action's use metadatas.
   */
  public uses: Array<UseMetadata>;

  // -------------------------------------------------------------------------
  // Constructor
  // -------------------------------------------------------------------------

  constructor(
    controllerMetadata: ControllerMetadata,
    args: ActionMetadataArgs,
    private options: RoutingControllersOptions,
  ) {
    this.controllerMetadata = controllerMetadata;
    this.route = args.route;
    this.target = args.target;
    this.method = args.method;
    this.type = args.type;
    this.appendParams = args.appendParams;
    this.methodOverride = args.methodOverride;
  }

  // -------------------------------------------------------------------------
  // Public Methods
  // -------------------------------------------------------------------------

  /**
   * Builds everything action metadata needs.
   * Action metadata can be used only after its build.
   */
  public build(responseHandlers: Array<ResponseHandlerMetadata>) {
    const classTransformerResponseHandler = responseHandlers.find(
      handler => handler.type === 'response-class-transform-options',
    );
    const undefinedResultHandler = responseHandlers.find(handler => handler.type === 'on-undefined');
    const nullResultHandler = responseHandlers.find(handler => handler.type === 'on-null');
    const successCodeHandler = responseHandlers.find(handler => handler.type === 'success-code');
    const redirectHandler = responseHandlers.find(handler => handler.type === 'redirect');
    const renderedTemplateHandler = responseHandlers.find(handler => handler.type === 'rendered-template');
    const authorizedHandler = responseHandlers.find(handler => handler.type === 'authorized');
    const contentTypeHandler = responseHandlers.find(handler => handler.type === 'content-type');
    const bodyParam = this.params.find(param => param.type === 'body');

    if (classTransformerResponseHandler) {
      this.responseClassTransformOptions = classTransformerResponseHandler.value;
    }

    this.undefinedResultCode = undefinedResultHandler
      ? undefinedResultHandler.value
      : this.options.defaults && this.options.defaults.undefinedResultCode;

    this.nullResultCode = nullResultHandler
      ? nullResultHandler.value
      : this.options.defaults && this.options.defaults.nullResultCode;

    if (successCodeHandler) {
      this.successHttpCode = successCodeHandler.value;
    }
    if (redirectHandler) {
      this.redirect = redirectHandler.value;
    }
    if (renderedTemplateHandler) {
      this.renderedTemplate = renderedTemplateHandler.value;
    }

    this.bodyExtraOptions = bodyParam ? bodyParam.extraOptions : undefined;
    this.isBodyUsed = !!this.params.find(param => param.type === 'body' || param.type === 'body-param');
    this.isFilesUsed = !!this.params.find(param => param.type === 'files');
    this.isFileUsed = !!this.params.find(param => param.type === 'file');
    this.isJsonTyped =
      contentTypeHandler !== undefined
        ? /json/.test(contentTypeHandler.value)
        : this.controllerMetadata.type === 'json';
    this.fullRoute = this.buildFullRoute();
    this.headers = this.buildHeaders(responseHandlers);

    this.isAuthorizedUsed = this.controllerMetadata.isAuthorizedUsed || !!authorizedHandler;
    this.authorizedRoles = (this.controllerMetadata.authorizedRoles || []).concat(
      (authorizedHandler && authorizedHandler.value) || [],
    );
  }

  // -------------------------------------------------------------------------
  // Public Methods
  // -------------------------------------------------------------------------

  /**
   * Calls action method.
   * Action method is an action defined in a user controller.
   */
  public callMethod(params: Array<any>) {
    const controllerInstance = this.controllerMetadata.instance;
    return controllerInstance[this.method].apply(controllerInstance, params);
  }

  // -------------------------------------------------------------------------
  // Private Methods
  // -------------------------------------------------------------------------

  /**
   * Builds full action route.
   */
  private buildFullRoute(): string | RegExp {
    if (this.route instanceof RegExp) {
      if (this.controllerMetadata.route) {
        return ActionMetadata.appendBaseRoute(this.controllerMetadata.route, this.route);
      }
      return this.route;
    }

    let path: string = '';
    if (this.controllerMetadata.route) {
      path += this.controllerMetadata.route;
    }
    if (this.route && typeof this.route === 'string') {
      path += this.route;
    }
    return path;
  }

  /**
   * Builds action response headers.
   */
  private buildHeaders(responseHandlers: Array<ResponseHandlerMetadata>) {
    const contentTypeHandler = responseHandlers.find(handler => handler.type === 'content-type');
    const locationHandler = responseHandlers.find(handler => handler.type === 'location');

    const headers: {[name: string]: string} = {};
    if (locationHandler) {
      headers.Location = locationHandler.value;
    }

    if (contentTypeHandler) {
      headers['Content-type'] = contentTypeHandler.value;
    }

    const headerHandlers = responseHandlers.filter(handler => handler.type === 'header');
    if (headerHandlers) {
      headerHandlers.map(handler => (headers[handler.value] = handler.secondaryValue));
    }

    return headers;
  }
}
