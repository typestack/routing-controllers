import * as express from 'express';
import * as bodyParser from 'body-parser';
import {Utils} from "../../src/Utils";
import {ControllerRunner} from "../../src/ControllerRunner";
import {ExpressHttpFramework} from "../../src/http-framework-integration/ExpressHttpFramework";

// we use require-all module to load all files from the given directory (do `npm install require-all` in order to use it)
require('require-all')({ dirname: __dirname + '/controllers' });

let app = express(); // create express server
app.use(bodyParser.json()); // setup body parser

let controllerHandler = new ControllerRunner(new ExpressHttpFramework(app));
controllerHandler.registerAllActions(); // register actions in the app
app.listen(3002); // run express app

console.log('Express server is running on port 3002. Open http://localhost:3002/blogs/ or http://localhost:3002/posts/');