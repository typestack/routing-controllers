import {ActionParameterHandler} from "./ActionParameterHandler";
import {MetadataBuilder} from "./metadata-builder/MetadataBuilder";
import {ActionMetadata} from "./metadata/ActionMetadata";
import {ActionProperties} from "./ActionProperties";
import {Driver} from "./driver/Driver";

/**
 * Registers controllers and middlewares in the given server framework.
 */
export class RoutingControllers {

    // -------------------------------------------------------------------------
    // Private properties
    // -------------------------------------------------------------------------

    /**
     * Used to check and handle controller action parameters.
     */
    private paramHandler: ActionParameterHandler;

    /**
     * Used to build metadata objects for controllers and middlewares.
     */
    private metadataBuilder: MetadataBuilder;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private driver: Driver) {
        this.paramHandler = new ActionParameterHandler(driver);
        this.metadataBuilder = new MetadataBuilder();
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
     * Registers all given controllers and actions from those controllers.
     */
    registerControllers(classes?: Function[]): this {
        const middlewares = this.metadataBuilder.buildMiddlewareMetadata(classes);
        const controllers = this.metadataBuilder.buildControllerMetadata(classes);
        controllers.forEach(controller => {
            controller.actions.forEach(action => {
                this.driver.registerAction(action, middlewares, (actionProperties: ActionProperties) => {
                    this.executeAction(action, actionProperties);
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
            .sort((middleware1, middleware2) => middleware1.priority - middleware2.priority)
            .reverse()
            .forEach(middleware => this.driver.registerMiddleware(middleware));

        return this;
    }

    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------

    /**
     * Executes given controller action.
     */
    protected executeAction(action: ActionMetadata, actionProperties: ActionProperties) {

        // compute all parameters
        const paramsPromises = action.params
            .sort((param1, param2) => param1.index - param2.index)
            .map(param => this.paramHandler.handleParam(actionProperties, param));

        // after all parameters are computed
        Promise.all(paramsPromises).then(params => {

            // execute action and handle result
            const result = action.callMethod(params);
            this.handleCallMethodResult(result, action, actionProperties);

        }).catch(error => { // otherwise simply handle error without action execution
            this.driver.handleError(error, action, actionProperties);
        });
    }

    /**
     * Handles result of the action method execution.
     */
    protected handleCallMethodResult(result: any, action: ActionMetadata, options: ActionProperties) {
        if (this.isPromiseLike(result)) {
            result
                .then((data: any) => {
                    return this.handleCallMethodResult(data, action, options);
                })
                .catch((error: any) => {
                    this.driver.handleError(error, action, options);
                });
        } else {
            this.driver.handleSuccess(result, action, options);
        }
    }

    /**
     * Checks if given value is a Promise-like object.
     */
    protected isPromiseLike(arg: any): arg is Promise<any> {
        return arg != null && typeof arg === "object" && typeof arg.then === "function";
    }

}
