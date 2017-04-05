import {MiddlewareGlobalAfter} from "../../../../../src/decorator/JsonResponse";
import {ErrorMiddlewareInterface} from "../../../../../src/middleware/ErrorMiddlewareInterface";

@MiddlewareGlobalAfter()
export class BlogErrorHandler implements ErrorMiddlewareInterface {

    error(error: any, request: any, response: any, next?: Function): void {
        console.log("Error handled on blog handler: ", error);
        next(error);
    }
    
}