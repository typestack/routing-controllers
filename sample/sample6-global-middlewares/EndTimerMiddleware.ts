import {ExpressMiddlewareInterface} from "../../src/driver/express/ExpressMiddlewareInterface";
import {Middleware} from "../../src/decorator/Middleware";

@Middleware({ global: true, type: "after" })
export class EndTimerMiddleware implements ExpressMiddlewareInterface {

    use(request: any, response: any, next?: Function): any {
        console.log("timer is ended.");
        next();
    }
    
}