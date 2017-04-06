import {MiddlewareInterface} from "../../src/middleware/MiddlewareInterface";
import {Middleware} from "../../src/decorator/Middleware";

@Middleware({ global: true, type: "after" })
export class EndTimerMiddleware implements MiddlewareInterface {

    use(request: any, response: any, next?: Function): any {
        console.log("timer is ended.");
        next();
    }
    
}