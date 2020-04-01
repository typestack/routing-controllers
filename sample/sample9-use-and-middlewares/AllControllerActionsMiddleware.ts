import {ExpressMiddlewareInterface} from "../../src/driver/express/ExpressMiddlewareInterface";
import express from "express";

export class AllControllerActionsMiddleware implements ExpressMiddlewareInterface {
    use(request: express.Request, response: express.Response, next: express.NextFunction): any {
        console.log("controller action run");
        next();
    }
}
