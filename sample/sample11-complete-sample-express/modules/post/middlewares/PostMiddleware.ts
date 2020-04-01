import {ExpressMiddlewareInterface} from "../../../../../src/driver/express/ExpressMiddlewareInterface";
import express from "express";

export class PostMiddleware implements ExpressMiddlewareInterface {
    use(request: express.Request, response: express.Response, next: express.NextFunction): any {
        console.log("logging request from post middleware...");
        next();
    }
}
