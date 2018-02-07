import {User} from "../entity/User";

export interface Role {
    name: string;
    users: User[];
}