import {JsonController} from "../../../src/decorator/JsonController";
import {BaseController, BaseControllerClass} from "./BaseController";
import {Get} from "../../../src/decorator/Get";

@JsonController("/blogs")
export class BlogController extends BaseController("blog") {
    constructor() {
        super();
    }

    @Get()
    getAll() {
        return [
            {id: 1, name: `First ${this.name}!`},
            {id: 2, name: `Second ${this.name}!`},
            {id: 3, name: `Third ${this.name}!`}
        ];
    }
}