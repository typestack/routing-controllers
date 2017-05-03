/**
 * Controller action properties.
 */
export interface ActionProperties {

    /**
     * Action Request object.
     */
    request: any;

    /**
     * Action Response object.
     */
    response: any;

    /**
     * Content in which action is executed.
     * Koa-specific property.
     */
    context?: any;

    /**
     * "Next" function used to call next middleware.
     */
    next?: Function;

}
