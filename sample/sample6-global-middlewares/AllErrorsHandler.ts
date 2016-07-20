import {MiddlewareGlobalBefore} from "../../src/decorator/decorators";
import {ErrorMiddlewareInterface} from "../../src/middleware/ErrorMiddlewareInterface";

@MiddlewareGlobalBefore()
export class AllErrorsHandler implements ErrorMiddlewareInterface {

    error(error: any, request: any, response: any, next?: Function): void {
        console.log("Error handled: ", error);
        next(error);
    }
    
}