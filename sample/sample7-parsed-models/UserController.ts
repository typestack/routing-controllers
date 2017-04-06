import {JsonController} from "../../src/deprecated/JsonController";
import {UserFilter} from "./UserFilter";
import {User} from "./User";
import {Get} from "../../src/decorator/Get";
import {Post} from "../../src/decorator/Post";
import {QueryParam} from "../../src/decorator/QueryParam";
import {Body} from "../../src/decorator/Body";

@JsonController()
export class UserController {

    @Get("/users")
    getAll(@QueryParam("filter", { required: true, parse: true }) filter: UserFilter) {
        return filter.hasKeyword() ? "filter has long keyword" : "filter keyword is missing or too short";
    }

    @Post("/users")
    post(@Body() user: User) {
        user.password = "1234abcd";
        console.log("Is photo url empty?: ", user.photo.isUrlEmpty());
        return user;
    }
    
}