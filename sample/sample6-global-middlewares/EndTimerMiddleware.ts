import {ExpressMiddlewareInterface} from "../../src/driver/express/ExpressMiddlewareInterface";
import {Middleware} from "../../src/decorator/Middleware";
import express from "express";

@Middleware({ type: "after" })
export class EndTimerMiddleware implements ExpressMiddlewareInterface {
    use(request: express.Request, response: express.Response, next: express.NextFunction): any {
        console.log("timer is ended.");
        next();
    }
}
