import "reflect-metadata";
import {createKoaServer, createExpressServer} from "../../src/index";

// base directory. we use it because file in "required" in another module
const baseDir = __dirname;

// koa is used just as an example here. you can also use express
// to do it simply use createExpressServer instead of createKoaServer
const [app, router] = createKoaServer({
    controllerDirs: [baseDir + "/modules/**/controllers"],
    middlewareDirs: [baseDir + "/modules/**/middlewares"],
    errorHandlerDirs: [baseDir + "/modules/**/error-handlers"],
});
/*const app = createExpressServer({
    controllerDirs: [baseDir + "/modules/!**!/controllers"],
    middlewareDirs: [baseDir + "/modules/!**!/middlewares"],
    errorHandlerDirs: [baseDir + "/modules/!**!/error-handlers"],
});*/
app.listen(3001);

console.log("Koa server is running on port 3001. Open http://localhost:3001/blogs/");