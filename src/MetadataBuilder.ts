import {NextFunction, Request, Response} from "express";
import * as bodyParser from "body-parser";
import * as multer from "multer";
import * as cors from "cors";
import {graphiqlExpress} from "apollo-server-express";
import {makeExecutableSchema} from "graphql-tools";
import mergeSchemas from "graphql-tools/dist/stitching/mergeSchemas";
import {Container, ContainerInstance} from "typedi";
import {ErrorRequestHandler, RequestHandlerParams} from "express-serve-static-core";
import {ActionMetadata} from "./metadata/ActionMetadata";
import {ControllerMetadata} from "./metadata/ControllerMetadata";
import {ParamMetadata} from "./metadata/ParamMetadata";
import {ParamMetadataArgs} from "./metadata-args/ParamMetadataArgs";
import {ResponseHandlerMetadata} from "./metadata/ResponseHandleMetadata";
import {UseMetadata} from "./metadata/UseMetadata";
import {getMetadataArgsStorage} from "./index";
import {Utils} from "./Utils";
import {TypeStackFramework} from "./TypeStackFramework";
import {InterceptorInterface} from "./interface/InterceptorInterface";
import {Action} from "./Action";
import {MiddlewareInterface} from "./interface/MiddlewareInterface";
import {ErrorMiddlewareInterface} from "./interface/ErrorMiddlewareInterface";
import {AccessDeniedError} from "./error/AccessDeniedError";
import {AuthorizationCheckerNotDefinedError} from "./error/AuthorizationCheckerNotDefinedError";
import {AuthorizationRequiredError} from "./error/AuthorizationRequiredError";
import {EntityManager} from "typeorm";
import {HttpQueryError, runHttpQuery} from "apollo-server-core";
import DataLoader = require("dataloader");
const {mergeTypes, fileLoader} = require("merge-graphql-schemas");

/**
 * Builds metadata from the given metadata arguments.
 */
export class MetadataBuilder {

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private framework: TypeStackFramework) {
        this.buildControllerMetadata();
        this.buildResolverClasses();
        this.registerDefaultMiddlewares();
        this.registerMiddlewares();
        this.registerGraphQL();
    }
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------

    protected registerGraphQL() {
        const graphControllers = getMetadataArgsStorage().controllers.filter(controller => controller.type === "graph");
        if (graphControllers.length === 0)
            return;

        const graphQLRoute = this.framework.options.graphQLRoute || "/graphql";
        const graphIQLRoute = this.framework.options.graphIQLRoute || "/graphiql";

        if (!this.framework.options.schemas)
            throw new Error(`You must provide schemas in the configuration where from graphql schemas must be loaded and used.`);

        const schemaTypes = this.framework.options.schemas.reduce((types, schemaDir) => {
            types.push(...fileLoader(schemaDir));
            return types;
        }, []);

        const resolvers: any = {};
        const query: any = {};
        const mutation: any = {};
        const modelResolvers: any = {};
        // const dataLoaders: any = { };
        graphControllers.forEach(controller => {
            const graphActions = getMetadataArgsStorage().graphActions.filter(action => action.object.constructor === controller.target);
            graphActions.forEach(action => {
                const that = this;
                const callback = function(parent: any, args: any, context: any, info: any) {
                    // todo: setup container properly
                    context.container = Container.of(context.request);
                    if (that.framework.ormConnection) {
                        context.container.set(EntityManager, that.framework.ormConnection.manager);
                    }
                    return context.container.get(action.object.constructor as any)[action.propertyName](args, context, info);
                };
                if (action.type === "query") {
                    query[action.name || action.propertyName] = callback;

                } else if (action.type === "mutation") {
                    query[action.name || action.propertyName] = callback;
                }
            });
        });


        if (this.framework.ormConnection) {
            // if (this.framework.ormConnection)
            //     throw new Error(`TypeORM connection is not established, please make sure you to create ormconfig.json (or any other supported format) and make sure you have correct connection settings.`);


            this.framework.ormConnection.entityMetadatas.forEach(entityMetadata => {
                const resolverName = entityMetadata.targetName;
                if (!resolverName)
                    return;

                if (!modelResolvers[resolverName])
                    modelResolvers[resolverName] = {};

                entityMetadata.relations.forEach(relation => {

                    // make sure not to override method if it was defined by user
                    modelResolvers[resolverName][relation.propertyName] = (parent: any, args: any, context: any, info: any) => {
                        if (!context.dataLoaders[resolverName] || !context.dataLoaders[resolverName][relation.propertyName]) {
                            if (!context.dataLoaders[resolverName])
                                context.dataLoaders[resolverName] = {};

                            context.dataLoaders[resolverName][relation.propertyName] = new DataLoader((keys: { parent: any, args: any, context: any, info: any }[]) => {
                                const entities = keys.map(key => key.parent);
                                return this.framework
                                    .ormConnection
                                    .relationIdLoader
                                    .loadManyToManyRelationIdsAndGroup(relation, entities)
                                    .then(groups => groups.map(group => group.related));

                            }, {
                                cacheKeyFn: (key: { parent: any, args: any, context: any, info: any }) => {
                                    const {parent, args} = key;
                                    const entityIds = entityMetadata.getEntityIdMap(parent);
                                    return JSON.stringify({ entity: entityIds, args: args });
                                }
                            });
                        }
                        return context.dataLoaders[resolverName][relation.propertyName].load({parent, args, context, info});
                    };
                });
            });
        }

        getMetadataArgsStorage().resolvers.forEach(resolver => {
            const resolverName = resolver.name;
            if (!resolverName)
                throw new Error(`Resolver name is not set for controller ...`);

            // dataLoaders[resolverName] = {};
            if (!modelResolvers[resolverName])
                modelResolvers[resolverName] = {};

            getMetadataArgsStorage()
                .resolves
                .filter(resolve => resolve.object.constructor === resolver.target)
                .forEach(resolve => {
                    if (resolver.target.prototype[resolve.propertyName] === undefined)
                        return;

                    modelResolvers[resolverName][resolve.propertyName] = (parent: any, args: any, context: any, info: any) => {
                        if (resolve.dataLoader) {

                            if (!context.dataLoaders[resolverName] || !context.dataLoaders[resolverName][resolve.propertyName]) {
                                if (!context.dataLoaders[resolverName])
                                    context.dataLoaders[resolverName] = {};

                                context.dataLoaders[resolverName][resolve.propertyName] = new DataLoader((keys: { parent: any, args: any, context: any, info: any }[]) => {
                                    const entities = keys.map(key => key.parent);
                                    const args = keys[0].args;
                                    const context = keys[0].context;
                                    const info = keys[0].info;
                                    const container: ContainerInstance = context.container;

                                    const result = container.get<any>(resolver.target)[resolve.propertyName](entities, args, context, info);
                                    if (!(result instanceof Promise))
                                        return Promise.resolve(result);

                                    return result;
                                }, {
                                    cacheKeyFn: (key: { parent: any, args: any, context: any, info: any }) => {
                                        return JSON.stringify({parent: key.parent, args: key.args});
                                    }
                                });
                            }

                            return context.dataLoaders[resolverName][resolve.propertyName].load({ parent, args, context, info });

                        } else {
                            const container: ContainerInstance = context.container;
                            return container.get<any>(resolver.target)[resolve.propertyName](parent, args, context, info);
                        }
                    };
                });
        });

        if (Object.keys(query).length > 0) {
            resolvers["Query"] = query;
        }
        if (Object.keys(mutation).length > 0) {
            resolvers["Mutation"] = mutation;
        }

        const schema: any = {
            typeDefs: mergeTypes(schemaTypes),
            resolvers: {
                ...resolvers,
                ...modelResolvers
            },
            resolverValidationOptions: {
                allowResolversNotInSchema: true
            }
        };
        // console.log(schema);
        this.framework.application.use(graphQLRoute, bodyParser.json(),
            (req: Request, res: Response, next: NextFunction): void => {
                const options = {
                    context: {
                        request: req,
                        response: res,
                        dataLoaders: {}
                    },
                    schema: mergeSchemas({ schemas: [makeExecutableSchema(schema)] })
                };
                runHttpQuery([req, res], {
                    method: req.method,
                    options: options,
                    query: req.method === "POST" ? req.body : req.query,
                }).then((gqlResponse) => {
                    res.setHeader("Content-Type", "application/json");
                    res.setHeader("Content-Length", String(Buffer.byteLength(gqlResponse, "utf8")));
                    res.write(gqlResponse);
                    res.end();
                    Container.reset(req);
                }, (error: HttpQueryError) => {
                    if ( "HttpQueryError" !== error.name ) {
                        return next(error);
                    }

                    if ( error.headers ) {
                        Object.keys(error.headers).forEach((header) => {
                            res.setHeader(header, error.headers[header]);
                        });
                    }

                    res.statusCode = error.statusCode;
                    res.write(error.message);
                    res.end();
                });
        });
        this.framework.application.use(graphIQLRoute, graphiqlExpress({ endpointURL: graphQLRoute, }));
    }

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
        return controllers
            .filter(controllerArgs => {
                return controllerArgs.type === "json" || controllerArgs.type === "default";
            })
            .map(controllerArgs => {
                const controller = new ControllerMetadata(controllerArgs);
                controller.build(this.createControllerResponseHandlers(controller));
                controller.actions = this.createActions(controller);
                controller.uses = this.createControllerUses(controller);
                controller.interceptors = this.createControllerInterceptorUses(controller);
                return controller;
            })
            .forEach(controller => {
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
     * Imports resolvers from their directories.
     */
    protected buildResolverClasses() {
        const classes: Function[] = [];
        if (this.framework.options && this.framework.options.resolvers && this.framework.options.resolvers.length) {
            this.framework.options.resolvers.forEach(resolver => {
                if (typeof resolver === "string") {
                    classes.push(...Utils.importClassesFromDirectories([resolver]));
                } else {
                    classes.push(resolver);
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
