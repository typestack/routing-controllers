import {MiddlewareInterface} from "../../../../../src/interface/MiddlewareInterface";
import {defaultFakeService} from "../../FakeService";

export class PostMiddleware implements MiddlewareInterface {

    use(request: any, response: any, next?: (err?: any) => any): any {
        defaultFakeService.postMiddleware();
        next();
    }

}