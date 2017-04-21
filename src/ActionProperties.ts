/**
 * Controller action properties.
 */
export interface ActionProperties {

    /**
     * Content in which action is executed.
     * Koa-specific property.
     */
    context?: any;

    /**
     * Action Request object.
     * Express-specific property.
     */
    request?: any;

    /**
     * Action Response object.
     * Express-specific property.
     */
    response?: any;

    /**
     * "Next" function used to call next middleware.
     */
    next?: Function;

}
