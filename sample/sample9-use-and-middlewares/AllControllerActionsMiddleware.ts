import {MiddlewareInterface} from "../../src/middleware/MiddlewareInterface";
import {Middleware} from "../../src/decorator/Middleware";

@Middleware()
export class AllControllerActionsMiddleware implements MiddlewareInterface {

    use(request: any, response: any, next?: Function): any {
        console.log("controller action run");
        next();
    }
    
}