import {createExpressServer} from "../../src/index";

import "./BlogController";  // same as: require("./BlogController");
import "./CompressionMiddleware";  // same as: require("./CompressionMiddleware");
import "./LoggerMiddleware";  // same as: require("./LoggerMiddleware");
import "./StartTimerMiddleware";  // same as: require("./StartTimerMiddleware");
import "./EndTimerMiddleware";  // same as: require("./EndTimerMiddleware");
import "./AllErrorsHandler";  // same as: require("./AllErrorsHandler");

const app = createExpressServer(); // register controller actions in express app
app.listen(3006); // run express app

console.log("Express server is running on port 3006. Open http://localhost:3006/blogs/");