import {ServerResponse, ServerRequest} from "http";
import {Middleware} from "../../src/decorator/decorators";
import {ExpressMiddlewareInterface} from "../../src/middleware/ExpressMiddlewareInterface";

@Middleware({ afterAction: true })
export class EndTimerMiddleware implements ExpressMiddlewareInterface {

    use(request: ServerRequest, response: ServerResponse, next: Function): void {
        console.log("timer is ended.");
        next();
    }
    
}