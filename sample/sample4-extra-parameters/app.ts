import * as express from "express";
import {useExpressServer} from "../../src/index";

require("./BlogController");

let app = express(); // create express server
useExpressServer(app); // register loaded controllers in express app
app.listen(3004); // run express app

console.log("Express server is running on port 3004. Open http://localhost:3004/blogs/");