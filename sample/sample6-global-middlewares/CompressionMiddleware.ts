import {MiddlewareInterface} from "../../src/middleware/MiddlewareInterface";
import {Middleware} from "../../src/decorator/Middleware";

@Middleware({ global: true })
export class CompressionMiddleware implements MiddlewareInterface {

    use(request: any, response: any, next?: Function): any {
        console.log("hello compression ...");
        next();
    }
    
}