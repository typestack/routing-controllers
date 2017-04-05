import {MiddlewareInterface} from "../../../../../src/middleware/MiddlewareInterface";
import {Middleware} from "../../../../../src/deprecated/JsonResponse";

@Middleware()
export class PostMiddleware implements MiddlewareInterface {

    use(request: any, response: any, next?: Function): any {
        console.log("logging request from post middleware...");
        next();
    }

}