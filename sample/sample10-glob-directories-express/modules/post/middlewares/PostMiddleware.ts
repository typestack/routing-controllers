import {ServerResponse, ServerRequest} from "http";
import {ExpressMiddlewareInterface} from "../../../../../src/middleware/ExpressMiddlewareInterface";
import {Middleware} from "../../../../../src/decorator/decorators";

@Middleware()
export class PostMiddleware implements ExpressMiddlewareInterface {

    use(request: ServerRequest, response: ServerResponse, next: Function): void {
        console.log("logging request from post middleware...");
        next();
    }

    afterUse(request: ServerRequest, response: ServerResponse, next: Function): void {
        console.log("post middleware after all...");
        next();
    }
    
}