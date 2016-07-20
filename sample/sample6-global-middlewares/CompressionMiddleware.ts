import {ServerResponse, ServerRequest} from "http";
import {MiddlewareGlobalBefore} from "../../src/decorator/decorators";
import {MiddlewareInterface} from "../../src/middleware/MiddlewareInterface";

@MiddlewareGlobalBefore()
export class CompressionMiddleware implements MiddlewareInterface {

    use(request: any, response: any, next?: Function): any {
        console.log("hello compression ...");
        next();
    }
    
}