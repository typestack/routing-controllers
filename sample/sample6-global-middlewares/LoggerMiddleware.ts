import {ExpressMiddlewareInterface} from "../../src/driver/express/ExpressMiddlewareInterface";
import {Middleware} from "../../src/decorator/Middleware";

@Middleware({ global: true })
export class LoggerMiddleware implements ExpressMiddlewareInterface {

    use(request: any, response: any, next?: Function): any {
        console.log("logging request ...");
        next();
    }
    
}