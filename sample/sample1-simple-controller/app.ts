import "reflect-metadata";
import {bootstrap} from "../../src";
import {UserController} from "./UserController";

bootstrap({
    port: 3001,
    controllers: [UserController]
}).then(() => {
    console.log("Express server is running on port 3001. Open http://localhost:3001/users/");
});