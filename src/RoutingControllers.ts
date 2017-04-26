import {ActionParameterHandler} from "./ActionParameterHandler";
import {MetadataBuilder} from "./metadata-builder/MetadataBuilder";
import {ActionMetadata} from "./metadata/ActionMetadata";
import {ActionProperties} from "./ActionProperties";
import {Driver} from "./driver/Driver";
import {isPromiseLike} from "./util/isPromiseLike";

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
    private parameterHandler: ActionParameterHandler;

    /**
     * Used to build metadata objects for controllers and middlewares.
     */
    private metadataBuilder: MetadataBuilder;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private driver: Driver) {
        this.parameterHandler = new ActionParameterHandler(driver);
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
        const controllers = this.metadataBuilder.buildControllerMetadata(classes);
        controllers.forEach(controller => {
            controller.actions.forEach(action => {
                this.driver.registerAction(action, (actionProperties: ActionProperties) => {
                    return this.executeAction(action, actionProperties);
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
            .map(param => this.parameterHandler.handle(actionProperties, param));

        // after all parameters are computed
        return Promise.all(paramsPromises).then(params => {

            // execute action and handle result
            const result = action.callMethod(params);
            return this.handleCallMethodResult(result, action, actionProperties);

        }).catch(error => {

            // otherwise simply handle error without action execution
            return this.driver.handleError(error, action, actionProperties);
        });
    }

    /**
     * Handles result of the action method execution.
     */
    protected handleCallMethodResult(result: any, action: ActionMetadata, options: ActionProperties): any {
        if (isPromiseLike(result)) {
            return result
                .then((data: any) => {
                    return this.handleCallMethodResult(data, action, options);
                })
                .catch((error: any) => {
                    return this.driver.handleError(error, action, options);
                });
        } else {
            return this.driver.handleSuccess(result, action, options);
        }
    }

}
