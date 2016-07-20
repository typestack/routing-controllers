import {ServerResponse, ServerRequest} from "http";
import {Middleware, MiddlewareGlobalBefore} from "../../src/decorator/decorators";
import {ErrorHandlerInterface} from "../../src/middleware/ErrorHandlerInterface";

@MiddlewareGlobalBefore()
export class AllErrorsHandler implements ErrorHandlerInterface {

    error(error: any, request: any, response: any, next?: Function): void {
        console.log("Error handled: ", error);
        next(error);
    }
    
}