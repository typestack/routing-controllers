import {ActionMetadata} from './ActionMetadata';
import {ControllerMetadataArgs} from './args/ControllerMetadataArgs';
import {UseMetadata} from './UseMetadata';
import {getFromContainer} from '../container';
import {ResponseHandlerMetadata} from './ResponseHandleMetadata';
import {InterceptorMetadata} from './InterceptorMetadata';

/**
 * Controller metadata.
 */
export class ControllerMetadata {
  // -------------------------------------------------------------------------
  // Accessors
  // -------------------------------------------------------------------------

  /**
   * Gets instance of the controller.
   */
  get instance(): any {
    return getFromContainer(this.target);
  }

  // -------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------

  /**
   * Controller actions.
   */
  public actions: Array<ActionMetadata>;

  /**
   * Roles set by @Authorized decorator.
   */
  public authorizedRoles: Array<any>;

  /**
   * Middleware "use"-s applied to a whole controller.
   */
  public interceptors: Array<InterceptorMetadata>;

  /**
   * Indicates if this action uses Authorized decorator.
   */
  public isAuthorizedUsed: boolean;

  /**
   * Base route for all actions registered in this controller.
   */
  public route: string;

  /**
   * Indicates object which is used by this controller.
   */
  public target: Function;

  /**
   * Controller type. Can be default or json-typed. Json-typed controllers operate with json requests and responses.
   */
  public type: 'default' | 'json';

  /**
   * Middleware "use"-s applied to a whole controller.
   */
  public uses: Array<UseMetadata>;

  // -------------------------------------------------------------------------
  // Constructor
  // -------------------------------------------------------------------------

  constructor(args: ControllerMetadataArgs) {
    this.target = args.target;
    this.route = args.route;
    this.type = args.type;
  }

  // -------------------------------------------------------------------------
  // Public Methods
  // -------------------------------------------------------------------------

  /**
   * Builds everything controller metadata needs.
   * Controller metadata should be used only after its build.
   */
  public build(responseHandlers: Array<ResponseHandlerMetadata>) {
    const authorizedHandler = responseHandlers.find(handler => handler.type === 'authorized' && !handler.method);
    this.isAuthorizedUsed = !!authorizedHandler;
    this.authorizedRoles = [].concat((authorizedHandler && authorizedHandler.value) || []);
  }
}
