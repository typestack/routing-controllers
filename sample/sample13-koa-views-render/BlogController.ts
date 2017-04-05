import "reflect-metadata";
import {Controller} from "../../src/deprecated/JsonController";
import {Get, Post, Put, Patch, Delete} from "../../src/decorator/Method";
import {Render} from "../../src/deprecated/JsonResponse";

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