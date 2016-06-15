import {ServerResponse, ServerRequest} from "http";
import {Middleware} from "../../src/decorator/decorators";
import {ExpressErrorHandlerMiddlewareInterface} from "../../src/middleware/ExpressErrorHandlerMiddlewareInterface";

@Middleware({ global: true })
export class AllErrorsHandler implements ExpressErrorHandlerMiddlewareInterface {

    error(error: any, request: ServerRequest, response: ServerResponse, next: Function): void {
        console.log("Error handled: ", error);
        next(error);
    }
    
}