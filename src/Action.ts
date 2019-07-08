/**
 * Controller action properties.
 */
export interface Action {

    /**
     * Content in which action is executed.
     * Koa-specific property.
     */
    context?: any;

    /**
     * "Next" function used to call next middleware.
     */
    next?: Function;

    /**
     * Action Request object.
     */
    request: any;

    /**
     * Action Response object.
     */
    response: any;

}
