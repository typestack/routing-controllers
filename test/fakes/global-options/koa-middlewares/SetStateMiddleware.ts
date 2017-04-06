import {MiddlewareInterface} from "../../../../src/middleware/MiddlewareInterface";
import {User} from "../User";
import {Middleware} from "../../../../src/index";

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