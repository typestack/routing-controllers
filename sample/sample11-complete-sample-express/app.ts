import "reflect-metadata";
import {bootstrap} from "../../src/index";
import {BlogErrorHandler} from "./modules/blog/middlewares/BlogErrorHandler";
import {BlogMiddleware} from "./modules/blog/middlewares/BlogMiddleware";
import {PostErrorHandler} from "./modules/post/middlewares/PostErrorHandler";
import {PostMiddleware} from "./modules/post/middlewares/PostMiddleware";
import {QuestionErrorHandler} from "./modules/question/middlewares/QuestionErrorHandler";
import {QuestionMiddleware} from "./modules/question/middlewares/QuestionMiddleware";

// base directory. we use it because file in "required" in another module
const baseDir = __dirname;

// koa is used just as an example here. you can also use express
// to do it simply use createExpressServer instead of createKoaServer
bootstrap({
    port: 3001,
    controllers: [baseDir + "/modules/**/controllers/*{.js,.ts}"],
    middlewares: [
        BlogErrorHandler,
        BlogMiddleware,
        PostErrorHandler,
        PostMiddleware,
        QuestionErrorHandler,
        QuestionMiddleware
    ]
});

console.log("Koa server is running on port 3001. Open http://localhost:3001/blogs/");