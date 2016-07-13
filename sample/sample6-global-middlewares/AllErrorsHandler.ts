import {ServerResponse, ServerRequest} from "http";
import {Middleware, GlobalMiddleware} from "../../src/decorator/decorators";
import {ErrorHandlerInterface} from "../../src/middleware/ErrorHandlerInterface";

@GlobalMiddleware()
export class AllErrorsHandler implements ErrorHandlerInterface {

    error(error: any, request: any, response: any, next?: Function): void {
        console.log("Error handled: ", error);
        next(error);
    }
    
}