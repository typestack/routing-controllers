import "reflect-metadata";

import {createServer} from "../../src/index";

import "./BlogController";  // same as: require("./BlogController");
import "./CompressionMiddleware";  // same as: require("./CompressionMiddleware");
import "./LoggerMiddleware";  // same as: require("./LoggerMiddleware");
import "./StartTimerMiddleware";  // same as: require("./StartTimerMiddleware");
import "./EndTimerMiddleware";  // same as: require("./EndTimerMiddleware");
import "./AllErrorsHandler";  // same as: require("./AllErrorsHandler");

const app = createServer(); // register controller actions in express app
app.listen(3001); // run express app

console.log("Express server is running on port 3001. Open http://localhost:3001/blogs/");