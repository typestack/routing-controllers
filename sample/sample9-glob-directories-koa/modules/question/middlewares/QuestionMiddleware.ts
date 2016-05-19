import {KoaMiddlewareInterface} from "../../../../../src/middleware/KoaMiddlewareInterface";
import {Middleware} from "../../../../../src/decorator/decorators";

@Middleware()
export class QuestionMiddleware implements KoaMiddlewareInterface {

    use(context: any, next: () => Promise<any>) {
        console.log("logging request from question middleware...");
        // console.log("extra logging request from blog middleware...");
        return next().then(() => {
            console.log("question middleware after all...");
        });
    }

}