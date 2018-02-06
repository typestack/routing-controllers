import {MiddlewareInterface} from "../../src/interface/MiddlewareInterface";

export class StartTimerMiddleware implements MiddlewareInterface {

    use(request: any, response: any, next?: Function): any {
        console.log("timer is started.");
        next();
    }
    
}