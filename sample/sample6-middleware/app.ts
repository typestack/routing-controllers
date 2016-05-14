import * as express from "express";
import {registerActionsInExpressApp} from "../../src/routing-controllers";

require("./BlogController");
require("./CompressionMiddleware");
require("./LoggerMiddleware");

let app = express(); // create express server
registerActionsInExpressApp(app); // register controller actions in express app
app.listen(3006); // run express app

console.log("Express server is running on port 3006. Open http://localhost:3006/blogs/");