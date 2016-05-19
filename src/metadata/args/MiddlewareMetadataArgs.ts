/**
 * Metadata used to store registered middlewares.
 */
export interface MiddlewareMetadataArgs {
    
    /**
     * Object class of the middleware class.
     */
    target: Function;
    
    /**
     * Middleware name.
     */
    name: string;

    /**
     * Execution priority of the middleware.
     */
    priority: number;

    /**
     * List of routes to which this middleware is applied.
     */
    routes: string[];

    /**
     * Indicates if middleware must be executed after routing action is executed.
     */
    afterAction: boolean;

}