import "reflect-metadata";
import {bootstrap} from "../../src/index";
import {QuestionController} from "./QuestionController";

bootstrap({
    port: 3001,
    controllers: [QuestionController]
});

console.log("Express server is running on port 3001. Open http://localhost:3001/questions/");