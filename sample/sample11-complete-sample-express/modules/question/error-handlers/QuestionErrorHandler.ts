import {ServerResponse, ServerRequest} from "http";
import {ErrorHandlerInterface} from "../../../../../src/ErrorHandlerInterface";
import {ErrorHandler} from "../../../../../src/decorator/decorators";

@ErrorHandler()
export class QuestionErrorHandler implements ErrorHandlerInterface {

    handle(error: any, request: any, response: any, next?: Function): void {
        console.log("Error handled on question handler: ", error);
        next(error);
    }
    
}