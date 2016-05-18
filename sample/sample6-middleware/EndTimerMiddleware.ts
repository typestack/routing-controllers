import {ServerResponse, ServerRequest} from "http";
import {Middleware} from "../../src/decorator/decorators";
import {MiddlewareInterface} from "../../src/MiddlewareInterface";

@Middleware()
export class EndTimerMiddleware implements MiddlewareInterface {

    afterUse(request: ServerRequest, response: ServerResponse, next: Function): void {
        console.log("timer is ended.");
        next();
    }
    
}