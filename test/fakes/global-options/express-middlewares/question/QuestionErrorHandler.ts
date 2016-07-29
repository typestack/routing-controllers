import {MiddlewareGlobalAfter} from "../../../../../src/decorator/decorators";
import {ErrorMiddlewareInterface} from "../../../../../src/middleware/ErrorMiddlewareInterface";
import {defaultFakeService} from "../../FakeService";

@MiddlewareGlobalAfter()
export class QuestionErrorHandler implements ErrorMiddlewareInterface {

    error(error: any, request: any, response: any, next?: (err?: any) => any): any {
        defaultFakeService.questionErrorMiddleware();
        next(error);
    }

}