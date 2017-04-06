import {MiddlewareInterface} from "../../src/middleware/MiddlewareInterface";
import {Middleware} from "../../src/decorator/Middleware";

@Middleware({ global: true })
export class StartTimerMiddleware implements MiddlewareInterface {

    use(request: any, response: any, next?: Function): any {
        console.log("timer is started.");
        next();
    }
    
}