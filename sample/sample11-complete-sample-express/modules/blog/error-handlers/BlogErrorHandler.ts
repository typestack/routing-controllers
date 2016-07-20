import {ErrorHandlerInterface} from "../../../../../src/ErrorHandlerInterface";
import {ErrorHandler} from "../../../../../src/decorator/decorators";

@ErrorHandler()
export class BlogErrorHandler implements ErrorHandlerInterface {

    handle(error: any, request: any, response: any, next?: Function): void {
        console.log("Error handled on blog handler: ", error);
        next(error);
    }
    
}