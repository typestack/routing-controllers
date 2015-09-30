import * as express from 'express';
import * as bodyParser from 'body-parser';
import {defaultActionRegistry} from "../../src/ActionRegistry";

require('./BlogController');

let app = express(); // create express server
app.use(bodyParser.json()); // setup body parser
defaultActionRegistry.registerActions(app); // register actions in the app
app.listen(3004); // run express app

console.log('Express server is running on port 3004. Open http://localhost:3004/blogs/');