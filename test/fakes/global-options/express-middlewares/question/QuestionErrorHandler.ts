import {ErrorMiddlewareInterface} from "../../../../../src/interface/ErrorMiddlewareInterface";
import {defaultFakeService} from "../../FakeService";

export class QuestionErrorHandler implements ErrorMiddlewareInterface {

    error(error: any, request: any, response: any, next?: (err?: any) => any): any {
        defaultFakeService.questionErrorMiddleware();
        next(error);
    }

}