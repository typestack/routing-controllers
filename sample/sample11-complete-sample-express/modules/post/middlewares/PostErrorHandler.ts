import {ErrorMiddlewareInterface} from "../../../../../src/interface/ErrorMiddlewareInterface";

export class PostErrorHandler implements ErrorMiddlewareInterface {

    error(error: any, request: any, response: any, next?: Function): void {
        console.log("Error handled on post handler: ", error);
        next(error);
    }
    
}