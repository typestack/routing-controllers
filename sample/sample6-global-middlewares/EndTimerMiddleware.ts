import {ServerResponse, ServerRequest} from "http";
import {Middleware, GlobalMiddleware} from "../../src/decorator/decorators";
import {MiddlewareInterface} from "../../src/middleware/MiddlewareInterface";

@GlobalMiddleware({ afterAction: true })
export class EndTimerMiddleware implements MiddlewareInterface {

    use(request: ServerRequest, response: ServerResponse, next: Function): void {
        console.log("timer is ended.");
        next();
    }
    
}