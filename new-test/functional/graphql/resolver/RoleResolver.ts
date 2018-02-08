import {EntityManager} from "typeorm";
import {Resolver} from "../../../../src/decorator/Resolver";
import {ResolverInterface} from "../../../../src/interface/ResolverInterface";
import {Resolve} from "../../../../src/decorator/Resolve";
import {Role} from "../model/Role";
import {User} from "../entity/User";

@Resolver("Role")
export class RoleResolver implements ResolverInterface<Role> {

    constructor(private entityManager: EntityManager) {
    }

    @Resolve({ dataLoader: true })
    async users(roles: Role[]) {
        const users = await this.entityManager.find(User);
        return roles.map(role => {
            if (role.name === "Administrator") {
                return [users[0]];

            } else if (role.name === "Moderator") {
                return [users[0], users[1]];

            } else if (role.name === "User") {
                return users;

            }
        });
    }

}