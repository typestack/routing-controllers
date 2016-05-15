/**
 * ErrorHandler decorator options.
 */
export interface ErrorHandlerOptions {

    /**
     * Special priority to be used to define order of middlewares to be executed.
     */
    priority?: number;

    /**
     * Defines on which routes this middleware is applied.
     */
    routes?: string[];

}