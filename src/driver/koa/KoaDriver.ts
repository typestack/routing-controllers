import { Action } from '../../Action';
import { ActionMetadata } from '../../metadata/ActionMetadata';
import { BaseDriver } from '../BaseDriver';
import { MiddlewareMetadata } from '../../metadata/MiddlewareMetadata';
import { ParamMetadata } from '../../metadata/ParamMetadata';
import { UseMetadata } from '../../metadata/UseMetadata';
import { KoaMiddlewareInterface } from './KoaMiddlewareInterface';
import { AuthorizationCheckerNotDefinedError } from '../../error/AuthorizationCheckerNotDefinedError';
import { AccessDeniedError } from '../../error/AccessDeniedError';
import { isPromiseLike } from '../../util/isPromiseLike';
import { getFromContainer } from '../../container';
import { RoleChecker } from '../../RoleChecker';
import { AuthorizationRequiredError } from '../../error/AuthorizationRequiredError';
import { HttpError, NotFoundError } from '../../index';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookie = require('cookie');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const templateUrl = require('template-url');

/**
 * Integration with koa framework.
 */
export class KoaDriver extends BaseDriver {
  // -------------------------------------------------------------------------
  // Constructor
  // -------------------------------------------------------------------------

  constructor(
    public koa?: any,
    public router?: any
  ) {
    super();
    this.loadKoa();
    this.loadRouter();
    this.app = this.koa;
  }

  // -------------------------------------------------------------------------
  // Public Methods
  // -------------------------------------------------------------------------

  /**
   * Initializes the things driver needs before routes and middleware registration.
   */
  initialize() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const bodyParser = require('koa-bodyparser');
    this.koa.use(bodyParser());
    if (this.cors) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const cors = require('@koa/cors');
      if (this.cors === true) {
        this.koa.use(cors());
      } else {
        this.koa.use(cors(this.cors));
      }
    }
  }

  /**
   * Registers middleware that run before controller actions.
   */
  registerMiddleware(middleware: MiddlewareMetadata): void {
    if (middleware.target.prototype && middleware.target.prototype.use) {
      this.koa.use(function (ctx: any, next: any) {
        return getFromContainer<KoaMiddlewareInterface>(middleware.target).use(ctx, next);
      });
    }
  }

  /**
   * Registers action in the driver.
   */
  registerAction(actionMetadata: ActionMetadata, executeCallback: (options: Action) => any): void {
    // middlewares required for this action
    const defaultMiddlewares: any[] = [];

    if (actionMetadata.isAuthorizedUsed) {
      defaultMiddlewares.push((context: any, next: Function) => {
        if (!this.authorizationChecker) throw new AuthorizationCheckerNotDefinedError();

        const action: Action = { request: context.request, response: context.response, context, next };
        try {
          const checkResult =
            actionMetadata.authorizedRoles instanceof Function
              ? getFromContainer<RoleChecker>(actionMetadata.authorizedRoles, action).check(action)
              : this.authorizationChecker(action, actionMetadata.authorizedRoles);

          const handleError = (result: any) => {
            if (!result) {
              const error =
                actionMetadata.authorizedRoles.length === 0
                  ? new AuthorizationRequiredError(action)
                  : new AccessDeniedError(action);
              return this.handleError(error, actionMetadata, action);
            } else {
              return next();
            }
          };

          if (isPromiseLike(checkResult)) {
            return checkResult
              .then(result => handleError(result))
              .catch(error => this.handleError(error, actionMetadata, action));
          } else {
            return handleError(checkResult);
          }
        } catch (error) {
          return this.handleError(error, actionMetadata, action);
        }
      });
    }

    if (actionMetadata.isFileUsed || actionMetadata.isFilesUsed) {
      const multer = this.loadMulter();
      actionMetadata.params
        .filter(param => param.type === 'file')
        .forEach(param => {
          defaultMiddlewares.push(multer(param.extraOptions).single(param.name));
        });
      actionMetadata.params
        .filter(param => param.type === 'files')
        .forEach(param => {
          defaultMiddlewares.push(multer(param.extraOptions).array(param.name));
        });
    }

    // user used middlewares
    const uses = actionMetadata.controllerMetadata.uses.concat(actionMetadata.uses);
    const beforeMiddlewares = this.prepareMiddlewares(uses.filter(use => !use.afterAction));
    const afterMiddlewares = this.prepareMiddlewares(uses.filter(use => use.afterAction));

    // prepare route and route handler function
    let route = ActionMetadata.appendBaseRoute(this.routePrefix, actionMetadata.fullRoute);

    // @koa/router is strict about trailing slashes, allow accessing routes without them
    if (typeof route === 'string' && route.length > 1 && route.endsWith('/')) {
      route = route.substring(0, route.length - 1);
    }

    const routeHandler = (context: any, next: () => Promise<any>) => {
      const options: Action = { request: context.request, response: context.response, context, next };
      return executeCallback(options);
    };

    // This ensures that a request is only processed once. Multiple routes may match a request
    // e.g. GET /users/me matches both @All(/users/me) and @Get(/users/:id)), only the first matching route should
    // be called.
    // The following middleware only starts an action processing if the request has not been processed before.
    const routeGuard = (context: any, next: () => Promise<any>) => {
      if (!context.request.routingControllersStarted) {
        context.request.routingControllersStarted = true;
        return next();
      }
    };

    // finally register action in koa
    this.router[actionMetadata.type.toLowerCase()](
      ...[route, routeGuard, ...beforeMiddlewares, ...defaultMiddlewares, routeHandler, ...afterMiddlewares]
    );
  }

  /**
   * Registers all routes in the framework.
   */
  registerRoutes() {
    this.koa.use(this.router.routes());
    this.koa.use(this.router.allowedMethods());
  }

  /**
   * Gets param from the request.
   */
  getParamFromRequest(actionOptions: Action, param: ParamMetadata): any {
    const context = actionOptions.context;
    const request: any = actionOptions.request;
    switch (param.type) {
      case 'body':
        return request.body;

      case 'body-param':
        return request.body[param.name];

      case 'param':
        return context.params[param.name];

      case 'params':
        return context.params;

      case 'session':
        return context.session;

      case 'session-param':
        return context.session[param.name];

      case 'state':
        if (param.name) return context.state[param.name];
        return context.state;

      case 'query':
        return context.query[param.name];

      case 'queries':
        return context.query;

      case 'file':
        return actionOptions.context.request.file;

      case 'files':
        return actionOptions.context.request.files;

      case 'header':
        return context.headers[param.name.toLowerCase()];

      case 'headers':
        return request.headers;

      case 'cookie':
        if (!context.headers.cookie) return;
        const cookies = cookie.parse(context.headers.cookie);
        return cookies[param.name];

      case 'cookies':
        if (!request.headers.cookie) return {};
        return cookie.parse(request.headers.cookie);
    }
  }

  /**
   * Handles result of successfully executed controller action.
   */
  handleSuccess(result: any, action: ActionMetadata, options: Action): void {
    // if the action returned the context or the response object itself, short-circuits
    if (result && (result === options.response || result === options.context)) {
      return options.next();
    }

    // transform result if needed
    result = this.transformResult(result, action, options);

    if (action.redirect) {
      // if redirect is set then do it
      if (typeof result === 'string') {
        options.response.redirect(result);
      } else if (result instanceof Object) {
        options.response.redirect(templateUrl(action.redirect, result));
      } else {
        options.response.redirect(action.redirect);
      }
    } else if (action.renderedTemplate) {
      // if template is set then render it
      const renderOptions = result && result instanceof Object ? result : {};
      const ctxLocals = options.context.locals || {};
      const oldNext = options.next;
      options.next = () =>
        options.context.render(action.renderedTemplate, { ...ctxLocals, ...renderOptions }).then(oldNext);
    } else if (result === undefined) {
      // throw NotFoundError on undefined response
      if (action.undefinedResultCode instanceof Function) {
        throw new (action.undefinedResultCode as any)(options);
      } else if (!action.undefinedResultCode) {
        throw new NotFoundError();
      }
    } else if (result === null) {
      // send null response
      if (action.nullResultCode instanceof Function) throw new (action.nullResultCode as any)(options);

      options.response.body = null;
    } else if (result instanceof Uint8Array) {
      // check if it's binary data (typed array)
      options.response.body = Buffer.from(result as any);
    } else {
      // send regular result
      options.response.body = result;
    }

    // set http status code
    if (result === undefined && action.undefinedResultCode) {
      options.response.status = action.undefinedResultCode;
    } else if (result === null && action.nullResultCode) {
      options.response.status = action.nullResultCode;
    } else if (action.successHttpCode) {
      options.response.status = action.successHttpCode;
    } else if (options.response.body === null) {
      options.response.status = 204;
    }

    // apply http headers
    Object.keys(action.headers).forEach(name => {
      options.response.set(name, action.headers[name]);
    });

    return options.next();
  }

  /**
   * Handles result of failed executed controller action.
   */
  handleError(error: any, action: ActionMetadata | undefined, options: Action) {
    return new Promise<void>((resolve, reject) => {
      if (this.isDefaultErrorHandlingEnabled) {
        // apply http headers
        if (action) {
          Object.keys(action.headers).forEach(name => {
            options.response.set(name, action.headers[name]);
          });
        }

        // send error content
        if (action && action.isJsonTyped) {
          options.response.body = this.processJsonError(error);
        } else {
          options.response.body = this.processTextError(error);
        }

        // set http status
        if (error instanceof HttpError && error.httpCode) {
          options.response.status = error.httpCode;
        } else {
          options.response.status = 500;
        }

        return resolve();
      }
      return reject(error);
    });
  }

  // -------------------------------------------------------------------------
  // Protected Methods
  // -------------------------------------------------------------------------

  /**
   * Creates middlewares from the given "use"-s.
   */
  protected prepareMiddlewares(uses: UseMetadata[]) {
    const middlewareFunctions: Function[] = [];
    uses.forEach(use => {
      if (use.middleware.prototype && use.middleware.prototype.use) {
        // if this is function instance of MiddlewareInterface
        middlewareFunctions.push(async (context: any, next: (err?: any) => Promise<any>) => {
          try {
            return await getFromContainer<KoaMiddlewareInterface>(use.middleware).use(context, next);
          } catch (error) {
            return await this.handleError(error, undefined, {
              request: context.request,
              response: context.response,
              context,
              next,
            });
          }
        });
      } else {
        middlewareFunctions.push(use.middleware);
      }
    });
    return middlewareFunctions;
  }

  /**
   * Dynamically loads koa module.
   */
  protected loadKoa() {
    if (require) {
      if (!this.koa) {
        try {
          this.koa = new (require('koa'))();
        } catch (e) {
          throw new Error('koa package was not found installed. Try to install it: npm install koa@next --save');
        }
      }
    } else {
      throw new Error('Cannot load koa. Try to install all required dependencies.');
    }
  }

  /**
   * Dynamically loads @koa/router module.
   */
  private loadRouter() {
    if (require) {
      if (!this.router) {
        try {
          this.router = new (require('@koa/router'))();
        } catch (e) {
          throw new Error(
            '@koa/router package was not found installed. Try to install it: npm install @koa/router --save'
          );
        }
      }
    } else {
      throw new Error('Cannot load koa. Try to install all required dependencies.');
    }
  }

  /**
   * Dynamically loads @koa/multer module.
   */
  private loadMulter() {
    try {
      return require('@koa/multer');
    } catch (e) {
      throw new Error('@koa/multer package was not found installed. Try to install it: npm install @koa/multer --save');
    }
  }
}
