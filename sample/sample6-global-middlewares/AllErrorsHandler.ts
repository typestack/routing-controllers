import {MiddlewareGlobalBefore} from "../../src/decorator/decorators";
import {ErrorHandlerMiddlewareInterface} from "../../src/middleware/ErrorHandlerMiddlewareInterface";

@MiddlewareGlobalBefore()
export class AllErrorsHandler implements ErrorHandlerMiddlewareInterface {

    error(error: any, request: any, response: any, next?: Function): void {
        console.log("Error handled: ", error);
        next(error);
    }
    
}