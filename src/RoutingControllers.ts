import {Action} from "./Action";
import {ActionMetadata} from "./metadata/ActionMetadata";
import {ActionParameterHandler} from "./ActionParameterHandler";
import {BaseDriver} from "./driver/BaseDriver";
import {InterceptorInterface} from "./InterceptorInterface";
import {InterceptorMetadata} from "./metadata/InterceptorMetadata";
import {MetadataBuilder} from "./metadata-builder/MetadataBuilder";
import {RoutingControllersOptions} from "./RoutingControllersOptions";
import {getFromContainer} from "./container";
import {isPromiseLike} from "./util/isPromiseLike";
import {runInSequence} from "./util/runInSequence";

/**
 * Registers controllers and middlewares in the given server framework.
 */
export class RoutingControllers<T extends BaseDriver> {

    // -------------------------------------------------------------------------
    // Private properties
    // -------------------------------------------------------------------------

    /**
     * Used to check and handle controller action parameters.
     */
    private parameterHandler: ActionParameterHandler<T>;

    /**
     * Used to build metadata objects for controllers and middlewares.
     */
    private metadataBuilder: MetadataBuilder;

    /**
     * Global interceptors run on each controller action.
     */
    private interceptors: InterceptorMetadata[] = [];

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private driver: T, private options: RoutingControllersOptions) {
        this.parameterHandler = new ActionParameterHandler(driver);
        this.metadataBuilder = new MetadataBuilder(options);
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Initializes the things driver needs before routes and middleware registration.
     */
    initialize(): this {
        this.driver.initialize();
        return this;
    }

    /**
     * Registers all given interceptors.
     */
    registerInterceptors(classes?: Function[]): this {
        const interceptors = this.metadataBuilder
            .buildInterceptorMetadata(classes)
            .sort((middleware1, middleware2) => middleware1.priority - middleware2.priority)
            .reverse();
        this.interceptors.push(...interceptors);
        return this;
    }

    /**
     * Registers all given controllers and actions from those controllers.
     */
    registerControllers(classes?: Function[]): this {
        const controllers = this.metadataBuilder.buildControllerMetadata(classes);
        controllers.forEach(controller => {
            controller.actions.forEach(actionMetadata => {
                const interceptorFns = this.prepareInterceptors([
                    ...this.interceptors,
                    ...actionMetadata.controllerMetadata.interceptors,
                    ...actionMetadata.interceptors
                ]);
                this.driver.registerAction(actionMetadata, (action: Action) => {
                    return this.executeAction(actionMetadata, action, interceptorFns);
                });
            });
        });
        this.driver.registerRoutes();
        return this;
    }

    /**
     * Registers post-execution middlewares in the driver.
     */
    registerMiddlewares(type: "before"|"after", classes?: Function[]): this {
        this.metadataBuilder
            .buildMiddlewareMetadata(classes)
            .filter(middleware => middleware.global && middleware.type === type)
            .sort((middleware1, middleware2) => middleware2.priority - middleware1.priority)
            .forEach(middleware => this.driver.registerMiddleware(middleware));

        return this;
    }

    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------

    /**
     * Executes given controller action.
     */
    protected executeAction(actionMetadata: ActionMetadata, action: Action, interceptorFns: Function[]) {
        // compute all parameters
        const paramsPromises = actionMetadata.params
            .sort((param1, param2) => param1.index - param2.index)
            .map(param => this.parameterHandler.handle(action, param));

        // after all parameters are computed
        return Promise.all(paramsPromises).then(params => {

            // execute action and handle result
            const allParams = actionMetadata.appendParams ? actionMetadata.appendParams(action).concat(params) : params;
            const result = actionMetadata.methodOverride ? actionMetadata.methodOverride(actionMetadata, action, allParams) : actionMetadata.callMethod(allParams, action);
            return this.handleCallMethodResult(result, actionMetadata, action, interceptorFns);

        }).catch(error => {

            // otherwise simply handle error without action execution
            return this.driver.handleError(error, actionMetadata, action);
        });
    }

    /**
     * Handles result of the action method execution.
     */
    protected handleCallMethodResult(result: any, action: ActionMetadata, options: Action, interceptorFns: Function[]): any {
        if (isPromiseLike(result)) {
            return result
                .then((data: any) => {
                    return this.handleCallMethodResult(data, action, options, interceptorFns);
                })
                .catch((error: any) => {
                    return this.driver.handleError(error, action, options);
                });
        } else {

            if (interceptorFns) {
                const awaitPromise = runInSequence(interceptorFns, interceptorFn => {
                    const interceptedResult = interceptorFn(options, result);
                    if (isPromiseLike(interceptedResult)) {
                        return interceptedResult.then((resultFromPromise: any) => {
                            result = resultFromPromise;
                        });
                    } else {
                        result = interceptedResult;
                        return Promise.resolve();
                    }
                });

                return awaitPromise
                    .then(() => this.driver.handleSuccess(result, action, options))
                    .catch(error => this.driver.handleError(error, action, options));
            } else {
                return this.driver.handleSuccess(result, action, options);
            }
        }
    }
    /**
     * Creates interceptors from the given "use interceptors".
     */
    protected prepareInterceptors(uses: InterceptorMetadata[]): Function[] {
        return uses.map(use => {
            if (use.interceptor.prototype && use.interceptor.prototype.intercept) { // if this is function instance of InterceptorInterface
                return function (action: Action, result: any) {
                    return (getFromContainer(use.interceptor, action) as InterceptorInterface).intercept(action, result);
                };
            }
            return use.interceptor;
        });
    }


}
