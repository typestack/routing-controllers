import {User} from "../entity/User";

export class CurrentUser {

    id: number;
    user: User;

    constructor(userId: number) {
        this.id = userId;
        this.user = new User();
        this.user.id = userId;
    }

}