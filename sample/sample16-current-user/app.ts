import "reflect-metadata";
import {bootstrap} from "../../src/index";
import {QuestionController} from "./QuestionController";
import {Action} from "../../src/Action";
import {CurrentUser} from "./CurrentUser";

bootstrap({
    port: 3001,
    currentUser: CurrentUser,
    controllers: [QuestionController],
    currentUserLoader: async (action: Action, value?: any) => {
        // perform queries based on token from request headers
        // const token = action.request.headers["authorization"];
        // return database.findUserByToken(token);
        const currentUser = new CurrentUser();
        currentUser.firstName = "Johny";
        currentUser.lastName = "Cage";
        return currentUser;
    }
});

console.log("Express server is running on port 3001. Open http://localhost:3001/questions/");