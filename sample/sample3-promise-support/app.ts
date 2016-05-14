import * as express from "express";
import * as bodyParser from "body-parser";
import {useExpressServer} from "../../src/index";
import "./BlogController"; // this can be require("./BlogController") actually

let app = express(); // create express server
app.use(bodyParser.json()); // setup body parser
useExpressServer(app); // register controllers routes in our express application
// controllerRunner.isLogErrorsEnabled = true; // enable error logging of exception error into console
// controllerRunner.isStackTraceEnabled = true; // enable adding of stack trace to response message

app.listen(3003); // run express app

console.log("Express server is running on port 3003. Open http://localhost:3003/blogs/");