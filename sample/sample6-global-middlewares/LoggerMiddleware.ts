import {ServerResponse, ServerRequest} from "http";
import {Middleware, GlobalMiddleware} from "../../src/decorator/decorators";
import {MiddlewareInterface} from "../../src/middleware/MiddlewareInterface";

@GlobalMiddleware()
export class LoggerMiddleware implements MiddlewareInterface {

    use(request: ServerRequest, response: ServerResponse, next: Function): void {
        console.log("logging request ...");
        next();
    }
    
}