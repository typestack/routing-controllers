import {ExpressMiddlewareInterface} from "../../../src/driver/express/ExpressMiddlewareInterface";
import session from "express-session";
import express from "express";

export class SessionMiddleware implements ExpressMiddlewareInterface {
    private static instance: SessionMiddleware;
    private requestHandler: express.RequestHandler = session({
        secret: "super-secret",
        resave: false,
        saveUninitialized: true
    });

    constructor() {
        if (SessionMiddleware.instance) {
            return SessionMiddleware.instance
        }

        SessionMiddleware.instance = this;
    }

    public use(request: express.Request, response: express.Response, next?: express.NextFunction): express.RequestHandler {
        if (next) {
            return this.requestHandler(request, response, next);
        }
    }
}
