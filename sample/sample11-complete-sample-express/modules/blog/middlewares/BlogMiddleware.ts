import {ExpressMiddlewareInterface} from "../../../../../src/driver/express/ExpressMiddlewareInterface";
import express from "express";

export class BlogMiddleware implements ExpressMiddlewareInterface {
    use(request: express.Request, response: express.Response, next: express.NextFunction): any {
        console.log("logging request from blog middleware...");
        next("ERROR IN BLOG MIDDLEWARE");
        // console.log("extra logging request from blog middleware...");
    }
}
