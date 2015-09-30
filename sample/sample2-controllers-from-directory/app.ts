import * as express from 'express';
import * as bodyParser from 'body-parser';
import {defaultActionRegistry} from "../../src/ActionRegistry";
import {ControllerUtils} from "../../src/ControllerUtils";

ControllerUtils.requireAll([__dirname + '/controllers']); // require all controllers in the given directory
let app = express(); // create express server
app.use(bodyParser.json()); // setup body parser
defaultActionRegistry.registerActions(app); // register actions in the app
app.listen(3002); // run express app

console.log('Express server is running on port 3002. Open http://localhost:3003/blogs/ or http://localhost:3003/posts/');