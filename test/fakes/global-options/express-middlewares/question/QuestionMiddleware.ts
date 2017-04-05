import {MiddlewareGlobalBefore} from "../../../../../src/deprecated/JsonResponse";
import {MiddlewareInterface} from "../../../../../src/middleware/MiddlewareInterface";
import {defaultFakeService} from "../../FakeService";

@MiddlewareGlobalBefore()
export class QuestionMiddleware implements MiddlewareInterface {

    use(request: any, response: any, next?: (err?: any) => any): any {
        defaultFakeService.questionMiddleware();
        return next();
    }

}