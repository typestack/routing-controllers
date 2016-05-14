import * as express from "express";
import {registerActionsInExpressApp} from "../../src/index";
import {ControllerRegistrator} from "../../src/ControllerRegistrator";
import {ExpressServer} from "../../src/server/ExpressServer";

require("./BlogController");

let app = express(); // create express server
registerActionsInExpressApp(app); // register loaded controllers in express app

// alternative way of registering controllers
let controllerRunner = new ControllerRegistrator(new ExpressServer(app));
controllerRunner.errorOverridingMap = {
    ForbiddenError: {
        message: "Access is denied"
    },
    ValidationError: {
        httpCode: "400",
        message: "Oops, Validation failed."
    }
};
controllerRunner.registerAllActions(); // register actions in the app
app.listen(3005); // run express app

console.log("Express server is running on port 3005. Open http://localhost:3005/blogs/");