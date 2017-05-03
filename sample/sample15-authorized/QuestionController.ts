import "reflect-metadata";
import {Get} from "../../src/decorator/Get";
import {JsonController} from "../../src/decorator/JsonController";
import {Authorized} from "../../src/decorator/Authorized";

@JsonController()
export class QuestionController {

    @Authorized()
    @Get("/questions")
    all() {
        return [{
            id: 1,
            title: "Question #1"
        }];
    }

}