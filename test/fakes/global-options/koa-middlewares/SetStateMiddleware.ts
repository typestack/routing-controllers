import {MiddlewareInterface} from "../../../../src/middleware/MiddlewareInterface";
import {Middleware} from "../../../../src/deprecated/JsonResponse";
import {User} from "../User";

@Middleware()
export class SetStateMiddleware implements MiddlewareInterface {
    public use (context: any, next: (err?: any) => Promise<any>): Promise<any> {
        const user = new User();
        user.username = "pleerock";
        user.location = "Dushanbe, Tajikistan";
        user.twitter = "https://twitter.com/pleerock";
        context.state = user;
        return next();
    }
}