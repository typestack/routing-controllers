import {ExpressMiddlewareInterface} from "../../../../../src/driver/express/ExpressMiddlewareInterface";
import {defaultFakeService} from "../../FakeService";
import {Middleware} from "../../../../../src/decorator/Middleware";

@Middleware({ global: true })
export class PostMiddleware implements ExpressMiddlewareInterface {

    use(request: any, response: any, next?: (err?: any) => any): any {
        defaultFakeService.postMiddleware();
        next();
    }

}