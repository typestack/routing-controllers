import {ExpressMiddlewareInterface} from "../../src/driver/express/ExpressMiddlewareInterface";
import {Middleware} from "../../src/index";

@Middleware()
export class CompressionMiddleware implements ExpressMiddlewareInterface {

    use(request: any, response: any, next?: Function): any {
        console.log("hello compression ...");
        next();
    }
    
}