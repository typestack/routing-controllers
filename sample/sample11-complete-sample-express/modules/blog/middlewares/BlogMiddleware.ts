import {MiddlewareInterface} from "../../../../../src/interface/MiddlewareInterface";

export class BlogMiddleware implements MiddlewareInterface {

    use(request: any, response: any, next?: Function): any {
        console.log("logging request from blog middleware...");
        next("ERROR IN BLOG MIDDLEWARE");
        // console.log("extra logging request from blog middleware...");
    }
    
}