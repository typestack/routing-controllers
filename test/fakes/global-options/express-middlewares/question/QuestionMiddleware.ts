import {ExpressMiddlewareInterface} from "../../../../../src/driver/express/ExpressMiddlewareInterface";
import {defaultFakeService} from "../../FakeService";
import {Middleware} from "../../../../../src/decorator/Middleware";
import express from "express";

@Middleware({ type: "before" })
export class QuestionMiddleware implements ExpressMiddlewareInterface {
    use(request: express.Request, response: express.Response, next: express.NextFunction): any {
        defaultFakeService.questionMiddleware();
        return next();
    }
}
