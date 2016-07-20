import {ErrorHandlerInterface} from "../../../../../src/ErrorHandlerInterface";
import {ErrorHandler} from "../../../../../src/decorator/decorators";

@ErrorHandler()
export class PostErrorHandler implements ErrorHandlerInterface {

    handle(error: any, request: any, response: any, next?: Function): void {
        console.log("Error handled on post handler: ", error);
        next(error);
    }
    
}