import {MiddlewareInterface} from "../../../../../src/middleware/MiddlewareInterface";
import {Middleware} from "../../../../../src/decorator/Middleware";

@Middleware()
export class QuestionMiddleware implements MiddlewareInterface {

    use(request: any, response: any, next?: Function): any {
        console.log("logging request from question middleware...");
        next();

    }
    
}