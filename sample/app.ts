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
// app2.use(require("koa-body-parser")());

/*app2.use(function(context: any, next: Function) {
    console.log("koa request");
    return next().then(() => {
        
    });
});*/

/*router.get("/users", function (context: any, next: Function) {
    console.log("koa controller");
    context.body = "Hello Koa";
    return next();
});

app2.use(router.routes());
app2.use(router.allowedMethods());
app2.listen(3002);*/

@Controller()
class TestController {

    /*@UseBefore((request: any, response: any, next: Function) => {
        console.log("executing before controller");
        return next();
    })
    @UseAfter((request: any, response: any, next: Function) => {
        console.log("executing after controller");
        return next();
    })*/
    @UseBefore((context: any, next: Function) => {
        console.log("executing before controller");
        return next();
    })
    @UseAfter((context: any, next: Function) => {
        console.log("executing after controller");
        return next();
    })
    @Get("/users")
    getUsers() {
        console.log("executing controller");
        return "hello app";
    }

}

useExpressServer(app1).listen(3001);

useKoaServer(app2).listen(3002);