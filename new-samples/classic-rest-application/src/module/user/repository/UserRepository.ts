import {EntityRepository, Repository} from "typeorm";
import {User} from "../entity/User";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    // your entity repository methods here...

}