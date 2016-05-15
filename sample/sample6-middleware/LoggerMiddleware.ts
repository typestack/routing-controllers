import {ServerResponse, ServerRequest} from "http";
import {Middleware} from "../../src/decorator/decorators";
import {MiddlewareInterface} from "../../src/MiddlewareInterface";

@Middleware()
export class LoggerMiddleware implements MiddlewareInterface {

    use(request: ServerRequest, response: ServerResponse, next: Function): void {
        console.log("logging request ...");
        next();
    }
    
}