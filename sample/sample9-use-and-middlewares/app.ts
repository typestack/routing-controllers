import "reflect-metadata";
import {bootstrap} from "../../src/index";
import "./BlogController"; // same as: require("./BlogController");

bootstrap({
    port: 3001
}); // register controller actions in express app

console.log("Express server is running on port 3001. Open http://localhost:3001/blogs/");