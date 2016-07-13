import {ServerResponse, ServerRequest} from "http";
import {Middleware, GlobalMiddleware} from "../../src/decorator/decorators";
import {MiddlewareInterface} from "../../src/middleware/MiddlewareInterface";

@GlobalMiddleware()
export class StartTimerMiddleware implements MiddlewareInterface {

    use(request: any, response: any, next?: Function): any {
        console.log("timer is started.");
        next();
    }
    
}