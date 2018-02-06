import {ErrorMiddlewareInterface} from "../../../../../src/interface/ErrorMiddlewareInterface";

export class QuestionErrorHandler implements ErrorMiddlewareInterface {

    error(error: any, request: any, response: any, next?: Function): void {
        console.log("Error handled on question handler: ", error);
        next(error);
    }
    
}