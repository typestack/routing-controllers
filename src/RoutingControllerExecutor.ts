import {ParamHandler} from "./ParamHandler";
import {MetadataBuilder} from "./metadata-builder/MetadataBuilder";
import {ActionMetadata} from "./metadata/ActionMetadata";
import {ActionCallbackOptions} from "./ActionCallbackOptions";
import {Driver} from "./driver/Driver";
import {PromiseUtils} from "./util/PromiseUtils";

/**
 * Registers controllers and actions in the given server framework.
 */
export class RoutingControllerExecutor {

    // -------------------------------------------------------------------------
    // Private properties
    // -------------------------------------------------------------------------

    private paramHandler: ParamHandler;
    private metadataBuilder: MetadataBuilder;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private driver: Driver) {
        this.paramHandler = new ParamHandler(driver);
        this.metadataBuilder = new MetadataBuilder();
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    bootstrap() {
        this.driver.bootstrap();
        return this;
    }

    /**
     * Registers actions in the driver.
     */
    registerActions(classes?: Function[]): this {
        const middlewares = this.metadataBuilder.buildMiddlewareMetadata(classes);
        const interceptors = this.metadataBuilder.buildInterceptorMetadata(classes);
        const controllers = this.metadataBuilder.buildControllerMetadata(classes);
        controllers.forEach(controller => {
            controller.actions.forEach(action => {
                this.driver.registerAction(action, middlewares, interceptors, (options: ActionCallbackOptions) => {
                    this.handleAction(action, options);
                });
            });
        });
        this.driver.registerRoutes();
        return this;
    }

    /**
     * Registers post-execution middlewares in the driver.
     */
    registerMiddlewares(afterAction: boolean, classes?: Function[]): this {
        this.metadataBuilder
            .buildMiddlewareMetadata(classes)
            .filter(middleware => middleware.isGlobal && middleware.afterAction === afterAction)
            .sort((middleware1, middleware2) => middleware1.priority - middleware2.priority)
            .reverse()
            .forEach(middleware => {
                if (middleware.isErrorHandler) {
                    this.driver.registerErrorHandler(middleware);

                } else if (middleware.isUseMiddleware) {
                    this.driver.registerMiddleware(middleware);
                }
            });

        return this;
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    private handleAction(action: ActionMetadata, options: ActionCallbackOptions) {

        // compute all parameters
        const paramsPromises = action.params
            .sort((param1, param2) => param1.index - param2.index)
            .map(param => this.paramHandler.handleParam(options, param));

        // after all parameters are computed
        Promise.all(paramsPromises).then(params => {

            // execute action and handle result
            const result = action.executeAction(params);
            // if (result !== undefined)
            this.handleResult(result, action, options);

        }).catch(error => {
            this.driver.handleError(error, action, options);
            throw error;
        });
    }

    private handleResult(result: any, action: ActionMetadata, options: ActionCallbackOptions) {
        if (PromiseUtils.isPromiseLike(result)) {
            result
                .then((data: any) => {
                    return this.handleResult(data, action, options);
                })
                .catch((error: any) => {
                    this.driver.handleError(error, action, options);
                    throw error;
                });
        } else {
            if (options.useInterceptorFunctions) {
                const awaitPromise = PromiseUtils.runInSequence(options.useInterceptorFunctions, interceptorFn => {
                    const interceptedResult = interceptorFn(options.request, options.response, result);
                    if (interceptedResult instanceof Promise) {
                        return interceptedResult.then((resultFromPromise: any) => {
                            result = resultFromPromise;
                        });
                    } else {
                        result = interceptedResult;
                        return Promise.resolve();
                    }
                });

                awaitPromise
                    .then(() => this.driver.handleSuccess(result, action, options))
                    .catch(error => this.driver.handleError(error, action, options));
            } else {
                this.driver.handleSuccess(result, action, options);
            }

        }
    }

}
