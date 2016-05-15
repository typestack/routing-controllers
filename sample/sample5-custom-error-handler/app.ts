import * as express from "express";
import {useExpressServer} from "../../src/index";
import {RoutingControllerExecutor} from "../../src/RoutingControllerExecutor";
import {ExpressDriver} from "../../src/driver/ExpressDriver";

require("./BlogController");

let app = express(); // create express server
useExpressServer(app); // register loaded controllers in express app

// alternative way of registering controllers
let routingController = new RoutingControllerExecutor(new ExpressDriver(app));
routingController.errorOverridingMap = {
    ForbiddenError: {
        message: "Access is denied"
    },
    ValidationError: {
        httpCode: "400",
        message: "Oops, Validation failed."
    }
};
routingController.registerActions(); // register actions in the app
app.listen(3005); // run express app

console.log("Express server is running on port 3005. Open http://localhost:3005/blogs/");