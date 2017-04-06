import {MiddlewareInterface} from "../../../../../src/middleware/MiddlewareInterface";
import {defaultFakeService} from "../../FakeService";
import {Middleware} from "../../../../../src/decorator/Middleware";

@Middleware({ global: true })
export class QuestionMiddleware implements MiddlewareInterface {

    use(request: any, response: any, next?: (err?: any) => any): any {
        defaultFakeService.questionMiddleware();
        return next();
    }

}