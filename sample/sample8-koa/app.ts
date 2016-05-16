import {useKoaServer} from "../../src/index";
import "./BlogController"; // this can be require("./BlogController") actually
const Koa = require("koa");
const Router = require("koa-router");

const router = new Router();
const app = new Koa();
app.use(router.routes());
app.use(router.allowedMethods());
useKoaServer(app, router);
app.listen(3008);

console.log("Koa server is running on port 3008. Open http://localhost:3008/blogs/");