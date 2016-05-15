import * as express from "express";
import {useExpressServer} from "../../src/index";

require("./BlogController");

let app = express(); // create express server
useExpressServer(app, {
    errorOverridingMap: {
        ForbiddenError: {
            message: "Access is denied"
        },
        ValidationError: {
            httpCode: "400",
            message: "Oops, Validation failed."
        }
    }
});
app.listen(3005); // run express app

console.log("Express server is running on port 3005. Open http://localhost:3005/blogs/");