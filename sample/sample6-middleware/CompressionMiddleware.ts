import {ServerResponse, ServerRequest} from "http";
import {Middleware} from "../../src/decorator/decorators";
import {MiddlewareInterface} from "../../src/MiddlewareInterface";

@Middleware()
export class CompressionMiddleware implements MiddlewareInterface {

    use(request: ServerRequest, response: ServerResponse, next: Function): void {
        console.log("hello compression ...");
        next();
    }
    
}