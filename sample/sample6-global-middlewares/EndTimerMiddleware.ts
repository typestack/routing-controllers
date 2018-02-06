import {MiddlewareInterface} from "../../src/interface/MiddlewareInterface";

export class EndTimerMiddleware implements MiddlewareInterface {

    use(request: any, response: any, next?: Function): any {
        console.log("timer is ended.");
        next();
    }
    
}