import express from "express";
/**
 * Used to register middlewares.
 * This signature is used for express middlewares.
 */
export interface ExpressMiddlewareInterface {
    /**
     * Called before controller action is being executed.
     * This signature is used for Express Middlewares.
     */
    use(request: express.Request, response: express.Response, next: express.NextFunction): any;
}
