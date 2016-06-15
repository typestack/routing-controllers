import "reflect-metadata";
import {useKoaServer} from "../../src/index";
import "./BlogController"; // this can be require("./BlogController") actually
const Koa = require("koa");
const Router = require("koa-router");

const router = new Router();
const app = new Koa();
useKoaServer(app, router);
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3001);

console.log("Koa server is running on port 3001. Open http://localhost:3001/blogs/");