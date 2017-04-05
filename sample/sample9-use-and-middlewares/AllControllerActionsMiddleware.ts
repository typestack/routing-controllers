import {Middleware} from "../../src/deprecated/JsonResponse";
import {MiddlewareInterface} from "../../src/middleware/MiddlewareInterface";

@Middleware()
export class AllControllerActionsMiddleware implements MiddlewareInterface {

    use(request: any, response: any, next?: Function): any {
        console.log("controller action run");
        next();
    }
    
}