import {ExpressMiddlewareInterface} from "../../../../../src/driver/express/ExpressMiddlewareInterface";
import {Middleware} from "../../../../../src/decorator/Middleware";

@Middleware()
export class BlogMiddleware implements ExpressMiddlewareInterface {

    use(request: any, response: any, next?: Function): any {
        console.log("logging request from blog middleware...");
        next("ERROR IN BLOG MIDDLEWARE");
        // console.log("extra logging request from blog middleware...");
    }
    
}