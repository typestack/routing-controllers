import {MiddlewareInterface} from "../../../../../src/middleware/MiddlewareInterface";
import {defaultFakeService} from "../../FakeService";
import {Middleware} from "../../../../../src/decorator/Middleware";

@Middleware({ global: true })
export class PostMiddleware implements MiddlewareInterface {

    use(request: any, response: any, next?: (err?: any) => any): any {
        defaultFakeService.postMiddleware();
        next();
    }

}