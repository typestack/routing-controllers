/**
 * Action metadata used to storage information about registered action.
 */
export interface MiddlewareMetadata {

    /**
     * Route to be registered for the action.
     */
    route: string|RegExp;

    /**
     * Object on which's method this action is attached.
     */
    object: any;

    /**
     * Object's method that will be executed on this action.
     */
    method: string;

    /**
     * Additional action options.
     */
    options: MiddlewareOptions;
}


/**
 * Extra that can be set to middleware.
 */
export interface MiddlewareOptions {

}
