import {ExpressMiddlewareInterface} from "../../src/driver/express/ExpressMiddlewareInterface";
import {Middleware} from "../../src/decorator/Middleware";

@Middleware()
export class AllControllerActionsMiddleware implements ExpressMiddlewareInterface {

    use(request: any, response: any, next?: Function): any {
        console.log("controller action run");
        next();
    }
    
}