import * as express from "express";
import {registerActionsInExpressApp} from "controllers.ts/Factory";
import {ControllerRunner} from "controllers.ts/ControllerRunner";
import {ExpressServer} from "controllers.ts/server/ExpressServer";

require('./BlogController');

let app = express(); // create express server
registerActionsInExpressApp(app); // register loaded controllers in express app

// alternative way of registering controllers
let controllerRunner = new ControllerRunner(new ExpressServer(app));
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

console.log('Express server is running on port 3005. Open http://localhost:3005/blogs/');