import "reflect-metadata";
import {Get} from "../../src/decorator/Get";
import {JsonController} from "../../src/decorator/JsonController";
import {CurrentUser} from "./CurrentUser";

@JsonController()
export class QuestionController {

    constructor(private currentUser: CurrentUser) {
    }

    @Get("/questions")
    all() {
        return [{
            id: 1,
            title: "Question " + this.currentUser.firstName
        }];
    }

}