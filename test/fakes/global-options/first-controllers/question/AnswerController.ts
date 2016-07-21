import {JsonController} from "../../../../../src/decorator/controllers";
import {Get} from "../../../../../src/decorator/methods";

@JsonController()
export class AnswerController {

    @Get("/answers")
    getAll() {
        return [{
            id: 1,
            title: "#1"
        }, {
            id: 2,
            title: "#2"
        }];
    }

}