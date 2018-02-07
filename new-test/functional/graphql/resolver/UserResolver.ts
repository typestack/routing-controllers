import {Resolver} from "../../../../src/decorator/Resolver";
import {User} from "../entity/User";
import {ResolverInterface} from "../../../../src/interface/ResolverInterface";
import {Resolve} from "../../../../src/decorator/Resolve";

@Resolver(User)
export class UserResolver implements ResolverInterface<User> {

    @Resolve()
    name(users: User[]) {
        return users.map(user => user.firstName + " " + user.lastName);
    }

    @Resolve({ dataLoader: false })
    fullName(user: User) {
        return "#" + user.id + " " + user.firstName + " " + user.lastName;
    }

    @Resolve({ dataLoader: false })
    firstName(user: User) {
        return "";
    }

    @Resolve({ dataLoader: false })
    lastName(user: User) {
        if (user.id === 1)
            return user.lastName;

        return null;
    }

}