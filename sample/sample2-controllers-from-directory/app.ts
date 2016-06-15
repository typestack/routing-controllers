import "reflect-metadata";
import * as express from "express";
import {useExpressServer} from "../../src/index";

let app = express(); // create express server
useExpressServer(app, {
    controllerDirs: [__dirname + "/controllers"] // register controllers routes in our express app
});
app.listen(3001); // run express app

console.log("Express server is running on port 3001. Open http://localhost:3001/blogs/ or http://localhost:3002/posts/");