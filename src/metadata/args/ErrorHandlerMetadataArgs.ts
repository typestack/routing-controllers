/**
 * Metadata used to store registered error handlers.
 */
export interface ErrorHandlerMetadataArgs {
    
    /**
     * Object class of the error handler class.
     */
    target: Function;
    
    /**
     * Middleware name.
     */
    name: string;

    /**
     * Execution priority of the error handler.
     */
    priority: number;

    /**
     * List of routes to which this error handler is applied.
     */
    routes: string[];
    
}