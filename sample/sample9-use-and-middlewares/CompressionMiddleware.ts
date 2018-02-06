import {MiddlewareInterface} from "../../src/interface/MiddlewareInterface";

export class CompressionMiddleware implements MiddlewareInterface {

    use(request: any, response: any, next?: Function): any {
        console.log("hello compression ...");
        next();
    }
    
}