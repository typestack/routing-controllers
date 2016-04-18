import {JsonController, Controller} from "../../src/decorator/controllers";
import {Get, Post} from "../../src/decorator/methods";
import {QueryParam, Body} from "../../src/decorator/params";
import {UserFilter} from "./UserFilter";
import {User} from "./User";

@JsonController()
export class UserController {

    @Get("/users")
    getAll(@QueryParam("filter", { required: true, parseJson: true }) filter: UserFilter) {
        return filter.hasKeyword() ? "filter has long keyword" : "filter keyword is missing or too short";
    }

    @Post("/users")
    post(@Body({ parseJson: true }) user: User) {
        user.password = "1234abcd";
        console.log("Is photo url empty?: ", user.photo.isUrlEmpty());
        return user;
    }
    
}