import {MiddlewareGlobalBefore} from "../../../../../src/decorator/decorators";
import {MiddlewareInterface} from "../../../../../src/middleware/MiddlewareInterface";
import {defaultFakeService} from "../../FakeService";

@MiddlewareGlobalBefore()
export class PostMiddleware implements MiddlewareInterface {

    use(request: any, response: any, next?: (err?: any) => any): any {
        defaultFakeService.postMiddleware();
        next();
    }

}