/**
 * Middleware decorator options.
 */
export interface MiddlewareOptions {

    /**
     * Indicates if this is a global middleware. Global middleware applies to all routes of the project.
     */
    global?: boolean;

    /**
     * Special priority to be used to define order of middlewares to be executed.
     */
    priority?: number;

    /**
     * Indicates if middleware must be executed after routing action is executed.
     */
    afterAction?: boolean;

}