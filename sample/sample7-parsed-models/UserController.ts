import {JsonController} from "../../src/deprecated/JsonController";
import {UserFilter} from "./UserFilter";
import {User} from "./User";
import {JsonResponse} from "../../src/deprecated/JsonResponse";
import {Controller} from "../../src/decorator/Controller";
import {Get} from "../../src/decorator/Get";
import {Req} from "../../src/index";
import {Post} from "../../src/decorator/Post";
import {Put} from "../../src/decorator/Put";
import {Patch} from "../../src/decorator/Patch";
import {Delete} from "../../src/decorator/Delete";
import {QueryParam} from "../../src/decorator/QueryParam";
import {Param} from "../../src/decorator/Param";
import {Body} from "../../src/decorator/Body";

@JsonController()
export class UserController {

    @Get("/users")
    getAll(@QueryParam("filter", { required: true, parseJson: true }) filter: UserFilter) {
        return filter.hasKeyword() ? "filter has long keyword" : "filter keyword is missing or too short";
    }

    @Post("/users")
    post(@Body() user: User) {
        user.password = "1234abcd";
        console.log("Is photo url empty?: ", user.photo.isUrlEmpty());
        return user;
    }
    
}