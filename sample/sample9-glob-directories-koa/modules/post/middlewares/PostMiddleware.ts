import {ServerResponse, ServerRequest} from "http";
import {KoaMiddlewareInterface} from "../../../../../src/middleware/KoaMiddlewareInterface";
import {Middleware} from "../../../../../src/decorator/decorators";

@Middleware()
export class PostMiddleware implements KoaMiddlewareInterface {

    use(context: any, next: () => Promise<any>) {
        console.log("logging request from post middleware...");
        // console.log("extra logging request from blog middleware...");
        return next().then(() => {
            console.log("post middleware after all...");
        });
    }
    
}