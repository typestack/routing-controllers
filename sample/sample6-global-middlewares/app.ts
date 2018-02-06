import "reflect-metadata";
import {bootstrap} from "../../src/index";
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

const app = bootstrap({
    port: 3001
}); // register controller actions in express app

console.log("Express server is running on port 3001. Open http://localhost:3001/blogs/");