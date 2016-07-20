import {MiddlewareGlobalAfter} from "../../../../../src/decorator/decorators";
import {ErrorMiddlewareInterface} from "../../../../../src/middleware/ErrorMiddlewareInterface";

@MiddlewareGlobalAfter()
export class QuestionErrorHandler implements ErrorMiddlewareInterface {

    error(error: any, request: any, response: any, next?: Function): void {
        console.log("Error handled on question handler: ", error);
        next(error);
    }
    
}