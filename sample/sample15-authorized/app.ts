import "reflect-metadata";
import {createExpressServer} from "../../src/index";
import {QuestionController} from "./QuestionController";
import {ActionProperties} from "../../src/ActionProperties";

createExpressServer({
    controllers: [QuestionController],
    authorizationChecker: async (actionProperties: ActionProperties, roles?: string[]) => {
        // perform queries based on token from request headers
        // const token = actionProperties.request.headers["authorization"];
        // return database.findUserByToken(token).roles.in(roles);
        return false;
    }
}).listen(3001);

console.log("Express server is running on port 3001. Open http://localhost:3001/questions/");