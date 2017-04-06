import {ErrorMiddlewareInterface} from "../../../../../src/middleware/ErrorMiddlewareInterface";
import {defaultFakeService} from "../../FakeService";
import {Middleware} from "../../../../../src/decorator/Middleware";

@Middleware({ global: true, type: "after" })
export class QuestionErrorHandler implements ErrorMiddlewareInterface {

    error(error: any, request: any, response: any, next?: (err?: any) => any): any {
        defaultFakeService.questionErrorMiddleware();
        next(error);
    }

}