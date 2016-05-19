import {ServerResponse, ServerRequest} from "http";
import {Middleware} from "../../src/decorator/decorators";
import {ExpressMiddlewareInterface} from "../../src/middleware/ExpressMiddlewareInterface";

@Middleware()
export class LoggerMiddleware implements ExpressMiddlewareInterface {

    use(request: ServerRequest, response: ServerResponse, next: Function): void {
        console.log("logging request ...");
        next();
    }
    
}