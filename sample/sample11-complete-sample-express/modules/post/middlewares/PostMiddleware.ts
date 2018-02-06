import {MiddlewareInterface} from "../../../../../src/interface/MiddlewareInterface";

export class PostMiddleware implements MiddlewareInterface {

    use(request: any, response: any, next?: Function): any {
        console.log("logging request from post middleware...");
        next();
    }

}