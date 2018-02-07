import {GraphController} from "../../../../src/decorator/GraphController";
import {Query} from "../../../../src/decorator/Query";
import {EntityManager} from "typeorm";
import {User} from "../entity/User";

@GraphController()
export class UserController {

    constructor(private entityManager: EntityManager) {
    }

    @Query()
    users() {
        return this.entityManager.find(User);
    }

    @Query()
    user(args: { id: number }) {
        return this.entityManager.findOne(User, args.id);
    }

}