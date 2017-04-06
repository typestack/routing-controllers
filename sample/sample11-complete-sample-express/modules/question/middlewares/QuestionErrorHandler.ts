import {ErrorMiddlewareInterface} from "../../../../../src/middleware/ErrorMiddlewareInterface";
import {Middleware} from "../../../../../src/decorator/Middleware";

@Middleware({ global: true, type: "after" })
export class QuestionErrorHandler implements ErrorMiddlewareInterface {

    error(error: any, request: any, response: any, next?: Function): void {
        console.log("Error handled on question handler: ", error);
        next(error);
    }
    
}