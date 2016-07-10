import {ServerResponse, ServerRequest} from "http";
import {MiddlewareInterface} from "../../../../../src/middleware/MiddlewareInterface";
import {Middleware} from "../../../../../src/decorator/decorators";

@Middleware()
export class BlogMiddleware implements MiddlewareInterface {

    use(request: ServerRequest, response: ServerResponse, next: Function): void {
        console.log("logging request from blog middleware...");
        next("ERROR IN BLOG MIDDLEWARE");
        // console.log("extra logging request from blog middleware...");
    }

    afterUse(request: ServerRequest, response: ServerResponse, next: Function): void {
        console.log("blog middleware after all...");
        next();
    }
    
    onError(error: any, request: ServerRequest, response: ServerResponse, next: Function): void {
        console.log("handling error from middleware...");
        next(error);
    }
    
}