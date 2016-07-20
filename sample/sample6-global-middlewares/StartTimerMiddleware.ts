import {ServerResponse, ServerRequest} from "http";
import {Middleware, MiddlewareGlobalBefore} from "../../src/decorator/decorators";
import {MiddlewareInterface} from "../../src/middleware/MiddlewareInterface";

@MiddlewareGlobalBefore()
export class StartTimerMiddleware implements MiddlewareInterface {

    use(request: any, response: any, next?: Function): any {
        console.log("timer is started.");
        next();
    }
    
}