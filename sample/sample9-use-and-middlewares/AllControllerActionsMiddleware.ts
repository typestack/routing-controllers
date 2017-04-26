import {ExpressMiddlewareInterface} from "../../src/driver/express/ExpressMiddlewareInterface";

export class AllControllerActionsMiddleware implements ExpressMiddlewareInterface {

    use(request: any, response: any, next?: Function): any {
        console.log("controller action run");
        next();
    }
    
}