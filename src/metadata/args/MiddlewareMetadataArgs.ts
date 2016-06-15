/**
 * Metadata used to store registered middlewares.
 */
export interface MiddlewareMetadataArgs {
    
    /**
     * Object class of the middleware class.
     */
    target: Function;

    /**
     * Indicates if this middleware is global, thous applied to all routes.
     */
    isGlobal: boolean;

    /**
     * Execution priority of the middleware.
     */
    priority: number;

    /**
     * Indicates if middleware must be executed after routing action is executed.
     */
    afterAction: boolean;

}