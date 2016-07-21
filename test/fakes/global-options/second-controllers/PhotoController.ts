import {Controller} from "../../../../src/decorator/controllers";
import {Get} from "../../../../src/decorator/methods";

@Controller()
export class PhotoController {

    @Get("/photos")
    getAll() {
        return "Hello photos";
    }

}