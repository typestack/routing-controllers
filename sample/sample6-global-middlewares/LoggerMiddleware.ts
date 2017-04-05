import {MiddlewareGlobalBefore} from "../../src/deprecated/JsonResponse";
import {MiddlewareInterface} from "../../src/middleware/MiddlewareInterface";

@MiddlewareGlobalBefore()
export class LoggerMiddleware implements MiddlewareInterface {

    use(request: any, response: any, next?: Function): any {
        console.log("logging request ...");
        next();
    }
    
}