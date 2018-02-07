import "reflect-metadata";
import {Action} from "./Action";
import {ActionMetadata} from "./metadata/ActionMetadata";
import {ActionParameterHandler} from "./ActionParameterHandler";
import {MetadataBuilder} from "./MetadataBuilder";
import {TypeStackOptions} from "./TypeStackOptions";
import {Container} from "typedi";
import * as express from "express";
import {Application, NextFunction, Request, Response} from "express";
import {Server} from "http";
import {classToPlain} from "class-transformer";
import {NotFoundError} from "./index";
import {HttpError} from "./http-error/HttpError";
import {Utils} from "./Utils";
import {PortNotSetError} from "./error/PortNotSetError";
import {Connection, ConnectionOptionsReader, createConnection, EntityManager, getMetadataArgsStorage} from "typeorm";

const templateUrl = require("template-url");

/**
 * Bootstraps TypeStack framework.
 * Registers controllers and middlewares and creates http server.
 */
export class TypeStackFramework {

    // -------------------------------------------------------------------------
    // Public Properties
    // -------------------------------------------------------------------------

    /**
     * Framework options.
     */
    options: TypeStackOptions;

    /**
     * Express application instance.
     */
    application: Application;

    /**
     * Running http server instance.
     */
    server: Server;

    /**
     * TypeORM connection.
     * Connection is setup only if typeorm connection settings are defined.
     */
    ormConnection: Connection;

    // -------------------------------------------------------------------------
    // Private Properties
    // -------------------------------------------------------------------------

    /**
     * Used to check and handle controller action parameters.
     */
    private parameterHandler: ActionParameterHandler;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(options: TypeStackOptions) {
        this.options = options;
        this.application = options.expressApp || express();
        this.parameterHandler = new ActionParameterHandler(this);
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Starts express application and http server.
     * If port is not given then port from the framework options will be used.
     */
    async start(port?: number): Promise<void> {
        if (!port && !this.options.port)
            throw new PortNotSetError();

        // create TypeORM connection if typeorm configuration file exist
        const hasConnection = await new ConnectionOptionsReader().has("default");
        if (hasConnection) {
            this.ormConnection = await createConnection();
        }

        new MetadataBuilder(this);

        return new Promise<void>((ok, fail) => {
            this.server = this.application.listen(port || this.options.port, (err: any) => err ? fail(err) : ok());
        });
    }

    /**
     * Stops express application and http server.
     */
    stop(): Promise<void> {
        if (!this.server)
            return Promise.resolve();

        return new Promise<void>((ok, fail) => {
            this.server.close((err: any) => err ? fail(err) : ok());
        });
    }

    /**
     * Registers action middlewares and a action route handler function.
     */
    registerAction(actionMetadata: ActionMetadata): void {
        (this.application as any)[actionMetadata.type.toLowerCase()](
            actionMetadata.fullRoute,
            ...actionMetadata.useFns,
            ...actionMetadata.middlewareFns,
            (request: Request, response: Response, next: NextFunction) => {

                // Express calls the "get" route automatically when we call the "head" route:
                // Reference: https://expressjs.com/en/4x/api.html#router.METHOD
                // This causes a double action execution on our side, which results in an unhandled rejection,
                // saying: "Can't set headers after they are sent".
                // The following line skips action processing when the request method does not match the action method.
                if (request.method.toLowerCase() !== actionMetadata.type)
                    return next();

                return this.computeParamsAndExecuteAction({
                    request: request,
                    response: response,
                    next: next,
                    metadata: actionMetadata,
                    interceptorFns: actionMetadata.interceptorFns
                });
            }
        );
    }

    /**
     * Handles result of failed executed controller action.
     */
    onError(action: Action, error: any) {
        this.handleError(action, error);
    }

    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------

    /**
     * Computes controller action parameters and executes this action.
     */
    protected computeParamsAndExecuteAction(action: Action): void {

        // compute all parameters and create a function that will be executed after parameters resolve
        const { values, hasPromises } = this.parameterHandler.handle(action);

        // execute action, if parameters returned any promise then resolve promises first
        if (hasPromises) {
            Promise.all(values).then(result => this.createContainerAndExecuteAction(action, result)).then(result => {

                // cleanup container for this controller action
                Container.reset(action);

                // return result back
                return result;

            }).catch(error => {

                // cleanup container for this controller action
                Container.reset(action);

                // handle error if method if it was thrown by method execution
                return this.handleError(action, error);
            });

        } else { // else execute action
            this.createContainerAndExecuteAction(action, values);
        }
    }

    /**
     * Setups container for the action and executes controller action.
     */
    protected createContainerAndExecuteAction(action: Action, params: any[]): Promise<any>|any {

        // create a new container for the current request and setup it
        action.container = Container.of(action);
        if (this.options.currentUser)
            action.container.set(this.options.currentUser, this.options.currentUserLoader(action));

        if (this.options.setupContainer) {
            const setupContainerResult = this.options.setupContainer(action.container);
            if (Utils.isPromiseLike(setupContainerResult)) {
                return setupContainerResult
                    .then(() => this.setupTransactionAndExecuteAction(action, params))
                    .catch(error => this.handleError(action, error));
            }
        }

        return this.setupTransactionAndExecuteAction(action, params);
    }

    /**
     * Setups entity manager and transaction stuff and executes controller action.
     */
    protected setupTransactionAndExecuteAction(action: Action, params: any[]): Promise<any>|any {

        // if TypeORM transaction is used then setup sub-container properly
        if (action.metadata.hasTransaction) {

            // create a transaction
            return this.ormConnection.manager.transaction(entityManager => {

                // register transactional entity manager and all custom repositories
                action.container.set(EntityManager, entityManager);
                getMetadataArgsStorage().entityRepositories.forEach(repository => {
                    action.container.set(repository.target, entityManager.getCustomRepository(repository.target));
                });

                return this.executeAction(action, params);
            });

        } else {

            // no transaction - register global entity manager
            if (this.ormConnection) // todo: take connection name from some decorator or decorator options
                action.container.set(EntityManager, this.ormConnection.manager);

            return this.executeAction(action, params);
        }
    }

    /**
     * Executes controller action.
     */
    protected executeAction(action: Action, params: any[]) {

        // if parameters handler is defined then apply it (allows to override / change parameters to be passed to the method)
        const allParams = action.metadata.parametersHandler ? action.metadata.parametersHandler(action, params) : params;

        // execute controller instance method
        const controller: any = action.container.get(action.metadata.controllerMetadata.target);
        const result = controller[action.metadata.method].apply(controller, allParams);

        // handle method result properly and respond
        return this.handleActionExecutionResult(action, result);
    }

    /**
     * Handles result of the action method execution and sends respond back if needed.
     */
    protected handleActionExecutionResult(action: Action, result: any): Promise<any>|any {

        // if returned result is a promise then resolve its value
        if (Utils.isPromiseLike(result)) {
            return result
                .then((value: any) => this.handleActionExecutionResult(action, value))
                .catch((error: any) => this.handleError(action, error));
        }

        // if interceptors are defined then execute them (and make sure to resolve their values if they are promises)
        // and use changed value as a new action execution result
        if (action.interceptorFns && action.interceptorFns.length) {
            const interceptorResolvedValue = Utils.runInSequence(action.interceptorFns, interceptorFn => {
                const interceptedResult = interceptorFn(action, result);
                if (Utils.isPromiseLike(interceptedResult)) {
                    return interceptedResult.then((resultFromPromise: any) => {
                        result = resultFromPromise;
                    });
                } else {
                    result = interceptedResult;
                    return Promise.resolve();
                }
            }).then(() => result);
            action.interceptorFns = [];
            return this.handleActionExecutionResult(action, interceptorResolvedValue);
        }

        // finally handle result
        return this.handleSuccess(action, result);
    }

    /**
     * Handles result of successfully executed controller action.
     */
    protected handleSuccess(action: Action, result: any): void {

        // if the action returned the response object itself, short-circuits
        if (result && result === action.response) {
            action.next();
            return;
        }

        // set http status code
        if (result === undefined && action.metadata.undefinedResultCode) {
            if (action.metadata.undefinedResultCode instanceof Function) {
                throw new (action.metadata.undefinedResultCode as any)(action);
            }
            action.response.status(action.metadata.undefinedResultCode);

        } else if (result === null) {
            if (action.metadata.nullResultCode) {
                if (action.metadata.nullResultCode instanceof Function) {
                    throw new (action.metadata.nullResultCode as any)(action);
                }
                action.response.status(action.metadata.nullResultCode);
            } else {
                action.response.status(204);
            }

        } else if (action.metadata.successHttpCode) {
            action.response.status(action.metadata.successHttpCode);
        }

        // apply http headers
        Object.keys(action.metadata.headers).forEach(name => {
            action.response.header(name, action.metadata.headers[name]);
        });

        if (action.metadata.redirect) { // if redirect is set then do it

            if (typeof result === "string") {
                action.response.redirect(result);

            } else if (result instanceof Object) {
                action.response.redirect(templateUrl(action.metadata.redirect, result));

            } else {
                action.response.redirect(action.metadata.redirect);
            }

            // action.next(); // calling next is deprecated, check if this bring any issues

        } else if (action.metadata.renderedTemplate) { // if template is set then render it
            const renderOptions = result && result instanceof Object ? result : {};

            action.response.render(action.metadata.renderedTemplate, renderOptions, (err: any, html: string) => {
                if (err && action.metadata.isJsonTyped) {
                    return action.next(err);

                } else if (err && !action.metadata.isJsonTyped) {
                    return action.next(err);

                } else if (html) {
                    action.response.send(html);
                }
                action.next();
            });

        } else if (result === undefined) { // throw NotFoundError on undefined response

            if (action.metadata.undefinedResultCode) {
                if (action.metadata.isJsonTyped) {
                    action.response.json();
                } else {
                    action.response.send();
                }
                // action.next(); // calling next is deprecated, check if this bring any issues

            } else {
                throw new NotFoundError();
            }

        } else if (result === null) { // send null response
            if (action.metadata.isJsonTyped) {
                action.response.json(null);
            } else {
                action.response.send(null);
            }
            // action.next(); // calling next is deprecated, check if this bring any issues

        } else if (result instanceof Buffer) { // check if it's binary data (Buffer)
            action.response.end(result, "binary");

        } else if (result instanceof Uint8Array) { // check if it's binary data (typed array)
            action.response.end(Buffer.from(result as any), "binary");

        } else if (result.pipe instanceof Function) {
            result.pipe(action.response);

        } else { // send regular result

            // class-transform result if its enabled
            if (this.isTransformationEnabled(result)) {
                const options = action.metadata.responseClassTransformOptions || this.options.classToPlainTransformOptions;
                result = classToPlain(result, options);
            }

            if (action.metadata.isJsonTyped) {
                action.response.json(result);
            } else {
                action.response.send(result);
            }

            // action.next(); // calling next is deprecated, check if this bring any issues
        }
    }

    /**
     * Handles result of failed executed controller action.
     */
    protected handleError(action: Action, error: any): any {
        const development = this.options.development !== undefined ? this.options.development : process.env.NODE_ENV !== "production";
        if (this.options.defaultErrorHandler === false)
            return action.next(error);

        // set http code
        if (error.httpCode) {
            action.response.status(error.httpCode);
        } else {
            action.response.status(500);
        }

        // apply http headers
        if (action.metadata) {
            Object.keys(action.metadata.headers).forEach(name => {
                action.response.header(name, action.metadata.headers[name]);
            });
        }

        // send error content
        if (action.metadata && action.metadata.isJsonTyped) {

            let content = error;
            if (typeof error.toJSON === "function")
                content = error.toJSON();

            let processedError: any = {};
            if (error instanceof Error) {
                const name = error.name && error.name !== "Error" ? error.name : error.constructor.name;
                processedError.name = name;

                if (error.message)
                    processedError.message = error.message;
                if (error.stack && development === true)
                    processedError.stack = error.stack;

                Object.keys(error)
                    .filter(key => key !== "stack" && key !== "name" && key !== "message" && (!(error instanceof HttpError) || key !== "httpCode"))
                    .forEach(key => processedError[key] = (error as any)[key]);

                if (this.options.errorOverridingMap)
                    Object.keys(this.options.errorOverridingMap)
                        .filter(key => name === key)
                        .forEach(key => processedError = Utils.merge(processedError, this.options.errorOverridingMap[key]));

                content = Object.keys(processedError).length > 0 ? processedError : undefined;
            }
            action.response.json(content);

        } else {

            let content = error;
            if (error instanceof Error) {
                if (development && error.stack) {
                    content = error.stack;

                } else if (error.message) {
                    content = error.message;
                }
            }

            action.response.send(content); // todo: no need to do it because express by default does it
        }

        action.next(error);
    }

    /**
     * Checks if controller action execution result must be class-transformed
     */
    protected isTransformationEnabled(result: any) {
        if (this.options.classTransformer === false)
            return false;

        if ((result instanceof Object) === false)
            return false;

        if (result instanceof Uint8Array || result.pipe instanceof Function)
            return false;

        return true;
    }

}
