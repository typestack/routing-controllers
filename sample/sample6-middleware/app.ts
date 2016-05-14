import * as express from "express";
import {useExpressServer} from "../../src/index";

import "./BlogController";  // same as: require("./BlogController");
import "./CompressionMiddleware";  // same as: require("./CompressionMiddleware");
import "./LoggerMiddleware";  // same as: require("./LoggerMiddleware");

let app = express(); // create express server
useExpressServer(app); // register controller actions in express app
app.listen(3006); // run express app

console.log("Express server is running on port 3006. Open http://localhost:3006/blogs/");