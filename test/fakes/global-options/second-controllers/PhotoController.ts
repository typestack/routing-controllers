import {Controller} from "../../../../src/decorator/JsonController";
import {Get} from "../../../../src/decorator/Method";

@Controller()
export class PhotoController {

    @Get("/photos")
    getAll() {
        return "Hello photos";
    }

}