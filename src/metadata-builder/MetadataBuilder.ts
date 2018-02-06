import {ActionMetadata} from "../metadata/ActionMetadata";
import {ControllerMetadata} from "../metadata/ControllerMetadata";
import {ParamMetadata} from "../metadata/ParamMetadata";
import {ParamMetadataArgs} from "../metadata-args/ParamMetadataArgs";
import {ResponseHandlerMetadata} from "../metadata/ResponseHandleMetadata";
import {UseMetadata} from "../metadata/UseMetadata";
import {getMetadataArgsStorage} from "../index";
import {Utils} from "../Utils";
import {TypeStackFramework} from "../TypeStackFramework";
import {Container} from "typedi";
import {InterceptorInterface} from "../interface/InterceptorInterface";
import {Action} from "../Action";
import {MiddlewareInterface} from "../interface/MiddlewareInterface";
import {ErrorMiddlewareInterface} from "../interface/ErrorMiddlewareInterface";
import {NextFunction, Request, Response} from "express";
import {AccessDeniedError} from "../error/AccessDeniedError";
import * as bodyParser from "body-parser";
import * as multer from "multer";
import {AuthorizationCheckerNotDefinedError} from "../error/AuthorizationCheckerNotDefinedError";
import {AuthorizationRequiredError} from "../error/AuthorizationRequiredError";
import {ErrorRequestHandler, RequestHandlerParams} from "express-serve-static-core";
import * as cors from "cors";

/**
 * Builds metadata from the given metadata arguments.
 */
export class MetadataBuilder {

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private framework: TypeStackFramework) {
        this.buildControllerMetadata();
        this.registerDefaultMiddlewares();
        this.registerMiddlewares();
    }
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------


    /**
     * Registers default middlewares used by the framework.
     */
    protected registerDefaultMiddlewares() {
        if (this.framework.options.cors) // register CORS if it was enabled
            this.framework.application.use(this.framework.options.cors === true ? cors() : cors(this.framework.options.cors));
    }

    /**
     * Registers global middlewares defined in the options.
     */
    protected registerMiddlewares() {
        if (!this.framework.options.middlewares || !this.framework.options.middlewares.length)
            return;

        this.framework.options.middlewares.forEach(middleware => {
            const instance: ErrorMiddlewareInterface & MiddlewareInterface = Container.has(middleware as any) ? Container.get(middleware as any) : undefined;

            // if its an error handler then register it with proper signature in express
            if (instance && instance.error) {
                this.framework.application.use(((error, request, response, next) => instance.error(error, request, response, next)) as ErrorRequestHandler);

            } else if (instance && instance.use) { // if its a regular middleware then register it as express middleware
                this.framework.application.use((request, response, next) => {
                    const action: Action = { request, response, next };
                    try {
                        const useResult = instance.use(request, response, next);
                        if (Utils.isPromiseLike(useResult)) {
                            useResult.catch(error => {
                                this.framework.onError(action, error);
                                return error;
                            });
                        }

                    } catch (error) {
                        this.framework.onError(action, error);
                    }
                });
            } else {
                this.framework.application.use(middleware as RequestHandlerParams);
            }
        });
    }

    /**
     * Builds controller metadata from a registered controller metadata args.
     */
    protected buildControllerMetadata() {
        const classes = this.buildControllerClasses();
        const controllers = !classes ? getMetadataArgsStorage().controllers : getMetadataArgsStorage().filterControllerMetadatasForClasses(classes);
        return controllers.map(controllerArgs => {
            const controller = new ControllerMetadata(controllerArgs);
            controller.build(this.createControllerResponseHandlers(controller));
            controller.actions = this.createActions(controller);
            controller.uses = this.createControllerUses(controller);
            controller.interceptors = this.createControllerInterceptorUses(controller);
            return controller;
        }).forEach(controller => {
            controller.actions.forEach(actionMetadata => {

                actionMetadata.interceptorFns = this.prepareInterceptors([
                    ...this.framework.options.interceptors || [],
                    ...actionMetadata.controllerMetadata.interceptors,
                    ...actionMetadata.interceptors
                ]);

                // user used middlewares
                actionMetadata.useFns = this.prepareMiddlewares([...actionMetadata.controllerMetadata.uses, ...actionMetadata.uses]);

                actionMetadata.middlewareFns = this.buildActionMiddlewares(actionMetadata);
                this.framework.registerAction(actionMetadata);
            });
        });
    }

    protected buildActionMiddlewares(actionMetadata: ActionMetadata): Function[] {

        // middlewares required for this action
        const middlewareFns: Function[] = [];

        // include body-parser middleware
        if (actionMetadata.isBodyUsed) {
            if (actionMetadata.isJsonTyped) {
                middlewareFns.push(bodyParser.json(actionMetadata.bodyExtraOptions));
            } else {
                middlewareFns.push(bodyParser.text(actionMetadata.bodyExtraOptions));
            }
        }

        // include authorization middleware
        if (actionMetadata.isAuthorizedUsed) {
            middlewareFns.push((request: Request, response: Response, next: NextFunction) => {
                if (!this.framework.options.authorizationChecker) // todo: extract this check, make it during metadata validation
                    throw new AuthorizationCheckerNotDefinedError();

                const action: Action = { request, response, next, metadata: actionMetadata };
                try {
                    const checkResult = this.framework.options.authorizationChecker(action, actionMetadata.authorizedRoles);

                    const handleError = (result: any) => {
                        if (!result) {
                            let error = actionMetadata.authorizedRoles.length === 0 ? new AuthorizationRequiredError(action) : new AccessDeniedError(action);
                            this.framework.onError(action, error);
                        } else {
                            next();
                        }
                    };

                    if (Utils.isPromiseLike(checkResult)) {
                        checkResult
                            .then(result => handleError(result))
                            .catch(error => this.framework.onError(action, error));
                    } else {
                        handleError(checkResult);
                    }
                } catch (error) {
                    this.framework.onError(action, error);
                }
            });
        }

        // add multer middleware if files decorators were used
        if (actionMetadata.isFileUsed || actionMetadata.isFilesUsed) {
            actionMetadata.params
                .filter(param => param.type === "file")
                .forEach(param => {
                    middlewareFns.push(multer(param.extraOptions).single(param.name));
                });
            actionMetadata.params
                .filter(param => param.type === "files")
                .forEach(param => {
                    middlewareFns.push(multer(param.extraOptions).array(param.name));
                });
        }

        return middlewareFns;
    }

    /**
     * Creates interceptors from the given "use interceptors".
     */
    protected prepareInterceptors(interceptors: Function[]): Function[] {
        return interceptors.map(interceptor => {
            const instance: InterceptorInterface|undefined = Container.has(interceptor as any) ? Container.get(interceptor as any) : undefined;
            if (instance && instance.intercept)
                return (action: Action, result: any) => instance.intercept(action, result);

            return interceptor;
        });
    }

    /**
     * Creates middlewares from the given "use"-s.
     */
    protected prepareMiddlewares(uses: UseMetadata[]) {
        const middlewareFunctions: Function[] = [];
        uses.forEach(use => {
            if (use.middleware.prototype && use.middleware.prototype.use) { // if this is function instance of MiddlewareInterface
                middlewareFunctions.push((request: any, response: any, next: (err: any) => any) => {
                    try {
                        const useResult = Container.get<MiddlewareInterface>(use.middleware).use(request, response, next);
                        if (Utils.isPromiseLike(useResult)) {
                            useResult.catch((error: any) => {
                                this.framework.onError({ request, response, next }, error);
                                return error;
                            });
                        }

                        return useResult;
                    } catch (error) {
                        this.framework.onError({ request, response, next }, error);
                    }
                });

            } else if (use.middleware.prototype && use.middleware.prototype.error) {  // if this is function instance of ErrorMiddlewareInterface
                middlewareFunctions.push(function (error: any, request: any, response: any, next: (err: any) => any) {
                    return Container.get<ErrorMiddlewareInterface>(use.middleware).error(error, request, response, next);
                });

            } else {
                middlewareFunctions.push(use.middleware);
            }
        });
        return middlewareFunctions;
    }

    /**
     *
     */
    protected buildControllerClasses() {
        const classes: Function[] = [];
        if (this.framework.options && this.framework.options.controllers && this.framework.options.controllers.length) {
            this.framework.options.controllers.forEach(controller => {
                if (typeof controller === "string") {
                    classes.push(...Utils.importClassesFromDirectories([controller]));
                } else {
                    classes.push(controller);
                }
            });
        }
        return classes;
    }

    /**
     * Creates action metadatas.
     */
    protected createActions(controller: ControllerMetadata): ActionMetadata[] {
        return getMetadataArgsStorage()
            .filterActionsWithTarget(controller.target)
            .map(actionArgs => {
                const action = new ActionMetadata(controller, actionArgs, this.framework.options);
                action.params = this.createParams(action);
                action.uses = this.createActionUses(action);
                action.interceptors = this.createActionInterceptorUses(action);
                action.build(this.createActionResponseHandlers(action));
                return action;
            });
    }

    /**
     * Creates param metadatas.
     */
    protected createParams(action: ActionMetadata): ParamMetadata[] {
        return getMetadataArgsStorage()
            .filterParamsWithTargetAndMethod(action.target, action.method)
            .map(paramArgs => new ParamMetadata(action, this.decorateDefaultParamOptions(paramArgs)));
    }

    /**
     * Decorate paramArgs with default settings
     */
    private decorateDefaultParamOptions(paramArgs: ParamMetadataArgs) {
        let options = this.framework.options.defaults && this.framework.options.defaults.paramOptions;
        if (!options)
            return paramArgs;
        
        if (paramArgs.required === undefined)
            paramArgs.required = options.required || false;

        return paramArgs;
    }

    /**
     * Creates response handler metadatas for action.
     */
    protected createActionResponseHandlers(action: ActionMetadata): ResponseHandlerMetadata[] {
        return getMetadataArgsStorage()
            .filterResponseHandlersWithTargetAndMethod(action.target, action.method)
            .map(handlerArgs => new ResponseHandlerMetadata(handlerArgs));
    }

    /**
     * Creates response handler metadatas for controller.
     */
    protected createControllerResponseHandlers(controller: ControllerMetadata): ResponseHandlerMetadata[] {
        return getMetadataArgsStorage()
            .filterResponseHandlersWithTarget(controller.target)
            .map(handlerArgs => new ResponseHandlerMetadata(handlerArgs));
    }

    /**
     * Creates use metadatas for actions.
     */
    protected createActionUses(action: ActionMetadata): UseMetadata[] {
        return getMetadataArgsStorage()
            .filterUsesWithTargetAndMethod(action.target, action.method)
            .map(useArgs => new UseMetadata(useArgs));
    }

    /**
     * Creates use interceptors for actions.
     */
    protected createActionInterceptorUses(action: ActionMetadata): Function[] {
        return getMetadataArgsStorage()
            .filterInterceptorUsesWithTargetAndMethod(action.target, action.method)
            .map(useArgs => useArgs.interceptor);
    }

    /**
     * Creates use metadatas for controllers.
     */
    protected createControllerUses(controller: ControllerMetadata): UseMetadata[] {
        return getMetadataArgsStorage()
            .filterUsesWithTargetAndMethod(controller.target, undefined)
            .map(useArgs => new UseMetadata(useArgs));
    }

    /**
     * Creates use interceptors for controllers.
     */
    protected createControllerInterceptorUses(controller: ControllerMetadata): Function[] {
        return getMetadataArgsStorage()
            .filterInterceptorUsesWithTargetAndMethod(controller.target, undefined)
            .map(useArgs => useArgs.interceptor);
    }

}
