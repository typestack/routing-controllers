import {Utils} from "./util/Utils";
import {ParamHandler} from "./ParamHandler";
import {MetadataBuilder} from "./metadata-builder/MetadataBuilder";
import {ActionMetadata} from "./metadata/ActionMetadata";
import {ActionCallbackOptions} from "./ActionCallbackOptions";
import {Driver} from "./driver/Driver";

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
        const controllers = this.metadataBuilder.buildControllerMetadata(classes);
        controllers.forEach(controller => {
            controller.actions.forEach(action => {
                this.driver.registerAction(action, middlewares, (options: ActionCallbackOptions) => {
                    this.handleAction(action, options);
                });
            });
        });
        this.driver.registerRoutes();
        return this;
    }

    /**
     * Registers error handler middlewares in the driver.
     */
    registerErrorHandlers(classes?: Function[]): this {

        this.metadataBuilder
            .buildMiddlewareMetadata(classes)
            .filter(middleware => middleware.isGlobal && !!middleware.expressErrorHandlerInstance.error)
            .sort((middleware1, middleware2) => middleware1.priority - middleware2.priority)
            .forEach(middleware => this.driver.registerErrorHandler(middleware));
        
       /* this.metadataBuilder
            .buildErrorHandlerMetadata(classes)
            .filter(errorHandler => !errorHandler.hasRoutes && !errorHandler.name)
            .sort((errorHandler1, errorHandler2) => errorHandler1.priority - errorHandler2.priority)
            .forEach(errorHandler => this.driver.registerErrorHandler(errorHandler));*/
        
        return this;
    }

    /**
     * Registers pre-execution middlewares in the driver.
     */
    registerPreExecutionMiddlewares(classes?: Function[]): this {

        this.metadataBuilder
            .buildMiddlewareMetadata(classes)
            .filter(middleware => middleware.isGlobal && !middleware.afterAction)
            .sort((middleware1, middleware2) => middleware1.priority - middleware2.priority)
            .forEach(middleware => this.driver.registerMiddleware(middleware));
        
        return this;
    }

    /**
     * Registers post-execution middlewares in the driver.
     */
    registerPostExecutionMiddlewares(classes?: Function[]): this {
        this.metadataBuilder
            .buildMiddlewareMetadata(classes)
            .filter(middleware => middleware.isGlobal && middleware.afterAction)
            .sort((middleware1, middleware2) => middleware1.priority - middleware2.priority)
            .reverse()
            .forEach(middleware => this.driver.registerMiddleware(middleware));
        
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
        if (Utils.isPromise(result)) {
            result
                .then((data: any) => {
                    return this.handleResult(data, action, options);
                })
                .catch((error: any) => {
                    this.driver.handleError(error, action, options);
                    throw error;
                });
        } else {
            this.driver.handleSuccess(result, action, options);
        }
    }

}