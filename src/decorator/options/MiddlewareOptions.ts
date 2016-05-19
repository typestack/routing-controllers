/**
 * Middleware decorator options.
 */
export interface MiddlewareOptions {

    /**
     * Special priority to be used to define order of middlewares to be executed.
     */
    priority?: number;

    /**
     * Defines on which routes this middleware is applied.
     */
    routes?: string[];

    /**
     * Indicates if middleware must be executed after routing action is executed.
     */
    afterAction: boolean;

}