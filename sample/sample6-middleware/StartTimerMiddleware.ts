import {ServerResponse, ServerRequest} from "http";
import {Middleware} from "../../src/decorator/decorators";
import {ExpressMiddlewareInterface} from "../../src/middleware/ExpressMiddlewareInterface";

@Middleware()
export class StartTimerMiddleware implements ExpressMiddlewareInterface {

    use(request: ServerRequest, response: ServerResponse, next: Function): void {
        console.log("timer is started.");
        next();
    }
    
}