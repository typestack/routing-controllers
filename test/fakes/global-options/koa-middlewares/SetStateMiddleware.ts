import {ExpressMiddlewareInterface} from "../../../../src/driver/express/ExpressMiddlewareInterface";
import {User} from "../User";

export class SetStateMiddleware implements ExpressMiddlewareInterface {
    public use (context: any, next: (err?: any) => Promise<any>): Promise<any> {
        const user = new User();
        user.username = "pleerock";
        user.location = "Dushanbe, Tajikistan";
        user.twitter = "https://twitter.com/pleerock";
        context.state = user;
        return next();
    }
}