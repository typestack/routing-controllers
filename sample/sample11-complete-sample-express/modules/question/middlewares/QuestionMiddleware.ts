import {MiddlewareInterface} from "../../../../../src/interface/MiddlewareInterface";

export class QuestionMiddleware implements MiddlewareInterface {

    use(request: any, response: any, next?: Function): any {
        console.log("logging request from question middleware...");
        next();

    }
    
}