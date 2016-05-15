import {ServerResponse, ServerRequest} from "http";
import {ErrorHandler} from "../../src/decorator/decorators";
import {ErrorHandlerInterface} from "../../src/ErrorHandlerInterface";

@ErrorHandler()
export class AllErrorsHandler implements ErrorHandlerInterface {

    handle(error: any, request: ServerRequest, response: ServerResponse, next: Function): void {
        console.log("Error handled: ", error);
        next(error);
    }
    
}