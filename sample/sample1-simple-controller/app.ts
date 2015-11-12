import * as express from 'express';
import * as bodyParser from 'body-parser';
import {ControllerRunner} from "../../src/ControllerRunner";
import {ExpressHttpFramework} from "../../src/http-framework-integration/ExpressHttpFramework";

require('./BlogController');

let app = express(); // create express server
app.use(bodyParser.json()); // setup body parser

let controllerHandler = new ControllerRunner(new ExpressHttpFramework(app));
controllerHandler.registerAllActions(); // register actions in the app
app.listen(3001); // run express app

console.log('Express server is running on port 3001. Open http://localhost:3001/blogs/');