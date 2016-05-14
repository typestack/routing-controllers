import * as express from "express";
import * as bodyParser from "body-parser";
import {registerActionsInExpressApp} from "../../src/index";

require("./UserController");

let app = express(); // create express server
app.use(bodyParser.json()); // setup body parser
registerActionsInExpressApp(app); // register controllers routes in our express application
app.listen(3007); // run express app

console.log("Express server is running on port 3007. Open http://localhost:3007/users/");