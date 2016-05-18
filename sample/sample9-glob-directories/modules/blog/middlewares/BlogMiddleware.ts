import {ServerResponse, ServerRequest} from "http";
import {MiddlewareInterface} from "../../../../../src/MiddlewareInterface";
import {Middleware} from "../../../../../src/decorator/decorators";

@Middleware()
export class BlogMiddleware implements MiddlewareInterface {

    use(request: ServerRequest, response: ServerResponse, next: Function): void {
        console.log("logging request from blog middleware...");
        next();
        console.log("extra logging request from blog middleware...");
    }

    afterUse(request: ServerRequest, response: ServerResponse, next: Function): void {
        console.log("blog middleware after all...");
        next();
    }
    
}