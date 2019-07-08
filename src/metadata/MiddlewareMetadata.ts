import {MiddlewareMetadataArgs} from './args/MiddlewareMetadataArgs';
import {ExpressMiddlewareInterface} from '../driver/express/ExpressMiddlewareInterface';
import {ExpressErrorMiddlewareInterface} from '../driver/express/ExpressErrorMiddlewareInterface';
import {getFromContainer} from '../container';
import {KoaMiddlewareInterface} from '../driver/koa/KoaMiddlewareInterface';

/**
 * Middleware metadata.
 */
export class MiddlewareMetadata {
  // -------------------------------------------------------------------------
  // Accessors
  // -------------------------------------------------------------------------

  /**
   * Gets middleware instance from the container.
   */
  get instance(): ExpressMiddlewareInterface | KoaMiddlewareInterface | ExpressErrorMiddlewareInterface {
    return getFromContainer<ExpressMiddlewareInterface | KoaMiddlewareInterface | ExpressErrorMiddlewareInterface>(
      this.target,
    );
  }

  // -------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------

  /**
   * Indicates if this middleware is global, thous applied to all routes.
   */
  public global: boolean;

  /**
   * Execution priority of the middleware.
   */
  public priority: number;

  /**
   * Object class of the middleware class.
   */
  public target: Function;

  /**
   * Indicates if middleware must be executed after routing action is executed.
   */
  public type: 'before' | 'after';

  // -------------------------------------------------------------------------
  // Constructor
  // -------------------------------------------------------------------------

  constructor(args: MiddlewareMetadataArgs) {
    this.global = args.global;
    this.target = args.target;
    this.priority = args.priority;
    this.type = args.type;
  }
}
