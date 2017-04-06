import "reflect-metadata";
import {createExpressServer} from "../../src/index";
import "./BlogController";
import "./CompressionMiddleware";
import "./LoggerMiddleware";
import "./StartTimerMiddleware";
import "./EndTimerMiddleware";
import "./AllErrorsHandler"; // same as: require("./BlogController");
// same as: require("./CompressionMiddleware");
// same as: require("./LoggerMiddleware");
// same as: require("./StartTimerMiddleware");
// same as: require("./EndTimerMiddleware");
// same as: require("./AllErrorsHandler");

const app = createExpressServer(); // register controller actions in express app
app.listen(3001); // run express app

console.log("Express server is running on port 3001. Open http://localhost:3001/blogs/");