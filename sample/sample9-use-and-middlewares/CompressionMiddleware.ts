import {Middleware} from "../../src/decorator/JsonResponse";
import {MiddlewareInterface} from "../../src/middleware/MiddlewareInterface";

@Middleware()
export class CompressionMiddleware implements MiddlewareInterface {

    use(request: any, response: any, next?: Function): any {
        console.log("hello compression ...");
        next();
    }
    
}