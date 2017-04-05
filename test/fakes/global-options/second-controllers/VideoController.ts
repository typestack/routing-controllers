import {Controller} from "../../../../src/deprecated/JsonController";
import {Get} from "../../../../src/decorator/Method";

@Controller()
export class VideoController {

    @Get("/videos")
    getAll() {
        return "Hello videos";
    }

}