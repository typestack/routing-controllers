import {ServerResponse, ServerRequest} from "http";
import {Middleware} from "../../src/decorator/decorators";
import {ExpressMiddlewareInterface} from "../../src/middleware/ExpressMiddlewareInterface";

@Middleware({ global: true })
export class CompressionMiddleware implements ExpressMiddlewareInterface {

    use(request: ServerRequest, response: ServerResponse, next: Function): void {
        console.log("hello compression ...");
        next();
    }
    
}