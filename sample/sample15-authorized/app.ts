import "reflect-metadata";
import {bootstrap} from "../../src/index";
import {QuestionController} from "./QuestionController";
import {Action} from "../../src/Action";

bootstrap({
    port: 3001,
    controllers: [QuestionController],
    authorizationChecker: async (action: Action, roles?: string[]) => {
        // perform queries based on token from request headers
        // const token = action.request.headers["authorization"];
        // return database.findUserByToken(token).roles.in(roles);
        return false;
    }
});

console.log("Express server is running on port 3001. Open http://localhost:3001/questions/");