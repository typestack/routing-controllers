import {ErrorMiddlewareInterface} from "../../src/middleware/ErrorMiddlewareInterface";
import {Middleware} from "../../src/decorator/Middleware";

@Middleware({ global: true })
export class AllErrorsHandler implements ErrorMiddlewareInterface {

    error(error: any, request: any, response: any, next?: Function): void {
        console.log("Error handled: ", error);
        next(error);
    }
    
}