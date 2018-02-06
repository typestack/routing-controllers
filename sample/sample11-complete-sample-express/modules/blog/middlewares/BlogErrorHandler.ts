import {ErrorMiddlewareInterface} from "../../../../../src/interface/ErrorMiddlewareInterface";

export class BlogErrorHandler implements ErrorMiddlewareInterface {

    error(error: any, request: any, response: any, next?: Function): void {
        console.log("Error handled on blog handler: ", error);
        next(error);
    }
    
}