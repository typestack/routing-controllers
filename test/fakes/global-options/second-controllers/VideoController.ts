import {Controller} from "../../../../src/decorator/Controller";
import {Get} from "../../../../src/decorator/Get";

@Controller()
export class VideoController {
    @Get("/videos")
    getAll(): string {
        return "Hello videos";
    }
}
