import {ErrorMiddlewareInterface} from "../../src/interface/ErrorMiddlewareInterface";

export class AllErrorsHandler implements ErrorMiddlewareInterface {

    error(error: any, request: any, response: any, next: Function): void {
        console.log("Error handled: ", error);
        next(error);
    }
    
}
