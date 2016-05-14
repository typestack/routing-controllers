import * as express from "express";
import {useExpressServer} from "../../src/index";

let app = express(); // create express server
useExpressServer([__dirname + "/controllers"]); // register controllers routes in our express app
app.listen(3002); // run express app

console.log("Express server is running on port 3002. Open http://localhost:3002/blogs/ or http://localhost:3002/posts/");