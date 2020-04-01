import express from "express";
import {HttpError} from "../../http-error/HttpError";

/**
 * Express error middlewares can implement this interface.
 */
export interface ExpressErrorMiddlewareInterface {
    /**
     * Called before response.send is being called. The data passed to method is the data passed to .send method.
     * Note that you must return same (or changed) data and it will be passed to .send method.
     */
    error(error: HttpError, request: express.Request, response: express.Response, next: express.NextFunction): any;
}
