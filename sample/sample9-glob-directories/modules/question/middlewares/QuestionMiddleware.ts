import {ServerResponse, ServerRequest} from "http";
import {MiddlewareInterface} from "../../../../../src/MiddlewareInterface";
import {Middleware} from "../../../../../src/decorator/decorators";

@Middleware()
export class QuestionMiddleware implements MiddlewareInterface {

    use(request: ServerRequest, response: ServerResponse, next: Function): void {
        console.log("logging request from question middleware...");
        next();

    }

    afterUse(request: ServerRequest, response: ServerResponse, next: Function): void {
        console.log("question middleware after all...");
        next();
    }
    
}