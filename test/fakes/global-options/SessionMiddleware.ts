import {MiddlewareInterface} from "../../../src/middleware/MiddlewareInterface";
import {Middleware} from "../../../src/decorator/decorators";
import * as session from "express-session";

const convert = require("koa-convert");
const KoaSession = require("koa-session");


@Middleware()
export class SessionMiddleware implements MiddlewareInterface {
    public use (requestOrContext: any, responseOrNext: any, next?: (err?: any) => any): any {
        if (next) {
            return this.expSession(requestOrContext, responseOrNext, next);
        } else {
            if (!this.koaSession) {
                this.koaSession = convert(KoaSession(requestOrContext.app));
            }
            return this.koaSession(requestOrContext, responseOrNext);
        }
    }

    private expSession = session({
        secret: "19majkel94_helps_pleerock",
    });

    private koaSession: any;
}