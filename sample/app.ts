import {UseBefore, UseAfter} from "../src/decorator/decorators";
import {Controller} from "../src/decorator/controllers";
import {useExpressServer, useKoaServer} from "../src/index";
import {Get} from "../src/decorator/methods";
const express = require("express");
const app1 = express();

app1.use(function(req: any, res: any, next: any) {
    console.log("express request");
    next();
});

app1.get("/", function(req: any, res: any, next: any) {
    res.send("Hello Express");
    next();
});

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

const koa = require("koa");
const app2 = new koa();
const multer = require("koa-router-multer");
const router = new (require("koa-router"))();
const upload = multer({ dest: 'uploads/' });
router.post("/users", upload.single('file'), function (context: any, next: Function) {
    console.log("koa controller");
    context.body = "Hello Koa";
    return next();
});

app2.use(router.routes());
app2.use(router.allowedMethods());
app2.listen(3002);