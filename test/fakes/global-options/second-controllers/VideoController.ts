import {Controller} from "../../../../src/decorator/controllers";
import {Get} from "../../../../src/decorator/methods";

@Controller()
export class VideoController {

    @Get("/videos")
    getAll() {
        return "Hello videos";
    }

}