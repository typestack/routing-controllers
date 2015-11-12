import * as express from 'express';
import * as bodyParser from 'body-parser';
import {ExpressHttpFramework} from "../../src/http-framework-integration/ExpressHttpFramework";
import {ControllerRunner} from "../../src/ControllerRunner";

require('./BlogController');

let app = express(); // create express server
app.use(bodyParser.json()); // setup body parser

let controllerHandler = new ControllerRunner(new ExpressHttpFramework(app));
controllerHandler.isLogErrorsEnabled = true; // enable error logging of exception error into console
controllerHandler.isStackTraceEnabled = true; // enable adding of stack trace to response message
controllerHandler.registerAllActions(); // register actions in the app
app.listen(3003); // run express app

console.log('Express server is running on port 3003. Open http://localhost:3003/blogs/');