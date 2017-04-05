import {Controller} from "../../../../src/decorator/JsonController";
import {Get} from "../../../../src/decorator/Method";

@Controller()
export class VideoController {

    @Get("/videos")
    getAll() {
        return "Hello videos";
    }

}