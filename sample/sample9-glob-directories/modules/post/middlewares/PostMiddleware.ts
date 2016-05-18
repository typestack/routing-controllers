import {ServerResponse, ServerRequest} from "http";
import {MiddlewareInterface} from "../../../../../src/MiddlewareInterface";
import {Middleware} from "../../../../../src/decorator/decorators";

@Middleware()
export class PostMiddleware implements MiddlewareInterface {

    use(request: ServerRequest, response: ServerResponse, next: Function): void {
        console.log("logging request from post middleware...");
        next();
    }

    afterUse(request: ServerRequest, response: ServerResponse, next: Function): void {
        console.log("post middleware after all...");
        next();
    }
    
}