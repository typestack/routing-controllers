import {ExpressErrorMiddlewareInterface} from "../../../../../src/driver/express/ExpressErrorMiddlewareInterface";
import {Middleware} from "../../../../../src/decorator/Middleware";

@Middleware({ global: true, type: "after" })
export class QuestionErrorHandler implements ExpressErrorMiddlewareInterface {

    error(error: any, request: any, response: any, next?: Function): void {
        console.log("Error handled on question handler: ", error);
        next(error);
    }
    
}