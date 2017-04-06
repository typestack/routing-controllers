import "reflect-metadata";
import {JsonResponse} from "../../src/deprecated/JsonResponse";
import {Controller} from "../../src/decorator/Controller";
import {Get} from "../../src/decorator/Get";
import {Req} from "../../src/index";
import {Post} from "../../src/decorator/Post";
import {Put} from "../../src/decorator/Put";
import {Patch} from "../../src/decorator/Patch";
import {Delete} from "../../src/decorator/Delete";
import {QueryParam} from "../../src/decorator/QueryParam";
import {Param} from "../../src/decorator/Param";
import {Body} from "../../src/decorator/Body";
import {Render} from "../../src/decorator/Render";

@Controller()
export class UserController {

    @Get("/")
    @Render("blog.html")
    blog() {
        return {
            title: "My Blog",
            posts: [
                {
                    title: "Welcome to my blog",
                    content: "This is my new blog built with Koa, routing-controllers and koa-views"
                },
                {
                    title: "Hello World",
                    content: "Hello world from Koa and routing-controllers"
                }
            ]
        };
    }
}