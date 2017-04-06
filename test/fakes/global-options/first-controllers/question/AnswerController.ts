import {JsonController} from "../../../../../src/deprecated/JsonController";
import {Get} from "../../../../../src/decorator/Get";

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