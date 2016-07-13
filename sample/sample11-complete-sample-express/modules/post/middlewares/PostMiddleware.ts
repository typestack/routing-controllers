import {ServerResponse, ServerRequest} from "http";
import {MiddlewareInterface} from "../../../../../src/middleware/MiddlewareInterface";
import {Middleware} from "../../../../../src/decorator/decorators";

@Middleware()
export class PostMiddleware implements MiddlewareInterface {

    use(request: any, response: any, next?: Function): any {
        console.log("logging request from post middleware...");
        next();
    }

}