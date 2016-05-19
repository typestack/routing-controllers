import {KoaMiddlewareInterface} from "../../../../../src/middleware/KoaMiddlewareInterface";
import {Middleware} from "../../../../../src/decorator/decorators";

@Middleware()
export class BlogMiddleware implements KoaMiddlewareInterface {

    use(context: any, next: () => Promise<any>) {
        console.log("logging request from blog middleware...");
        // console.log("extra logging request from blog middleware...");
        return next().then(() => {
            console.log("blog middleware after all...");
        });
    }
    
}