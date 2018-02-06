import {MiddlewareInterface} from "../../src/interface/MiddlewareInterface";

export class AllControllerActionsMiddleware implements MiddlewareInterface {

    use(request: any, response: any, next?: Function): any {
        console.log("controller action run");
        next();
    }
    
}