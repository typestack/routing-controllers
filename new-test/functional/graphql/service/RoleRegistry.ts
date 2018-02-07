import {Service} from "typedi";
import {Role} from "../model/Role";

@Service()
export class RoleRegistry {

    roles: Role[] = [
        { name: "Administrator" },
        { name: "Moderator" },
        { name: "User" },
    ];

}