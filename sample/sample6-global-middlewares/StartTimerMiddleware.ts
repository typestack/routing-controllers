import {ExpressMiddlewareInterface} from "../../src/driver/express/ExpressMiddlewareInterface";
import {Middleware} from "../../src/decorator/Middleware";
import express from "express";

@Middleware({ type: "before" })
export class StartTimerMiddleware implements ExpressMiddlewareInterface {
    use(request: express.Request, response: express.Response, next: express.NextFunction): any {
        console.log("timer is started.");
        next();
    }
}
