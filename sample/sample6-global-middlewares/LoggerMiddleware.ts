import {MiddlewareInterface} from "../../src/interface/MiddlewareInterface";

export class LoggerMiddleware implements MiddlewareInterface {

    use(request: any, response: any, next?: Function): any {
        console.log("logging request ...");
        next();
    }
    
}