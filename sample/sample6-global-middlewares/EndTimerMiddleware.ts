import {ServerResponse, ServerRequest} from "http";
import {Middleware, GlobalMiddleware} from "../../src/decorator/decorators";
import {MiddlewareInterface} from "../../src/middleware/MiddlewareInterface";

@GlobalMiddleware({ afterAction: true })
export class EndTimerMiddleware implements MiddlewareInterface {

    use(request: any, response: any, next?: Function): any {
        console.log("timer is ended.");
        next();
    }
    
}