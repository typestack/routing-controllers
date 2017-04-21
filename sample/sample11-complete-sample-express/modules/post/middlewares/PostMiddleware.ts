import {ExpressMiddlewareInterface} from "../../../../../src/driver/express/ExpressMiddlewareInterface";
import {Middleware} from "../../../../../src/decorator/Middleware";

@Middleware()
export class PostMiddleware implements ExpressMiddlewareInterface {

    use(request: any, response: any, next?: Function): any {
        console.log("logging request from post middleware...");
        next();
    }

}