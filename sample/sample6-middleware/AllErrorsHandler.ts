import {ServerResponse, ServerRequest} from "http";
import {ErrorHandler} from "../../src/decorator/decorators";
import {ErrorHandlerInterface} from "../../src/middleware/ErrorHandlerInterface";

@ErrorHandler()
export class AllErrorsHandler implements ErrorHandlerInterface {

    handle(error: any, request: ServerRequest, response: ServerResponse, next: Function): void {
        console.log("Error!: ", error);
        next(error);
    }
    
}