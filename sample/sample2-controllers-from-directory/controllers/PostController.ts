import {Request} from "express";
import {Get, Post, Put, Patch, Delete} from "../../../src/decorator/methods";
import {Req} from "../../../src/decorator/params";
import {JsonController} from "../../../src/decorator/controllers";

@JsonController()
export class PostController {

    @Get("/posts")
    getAll() {
        return [
            { id: 1, name: "First post!" },
            { id: 2, name: "Second post!" }
        ];
    }

    @Get("/posts/:id")
    getOne() {
        return { id: 1, name: "First post!" };
    }

    @Post("/posts")
    post(@Req() request: Request) {
        let post = JSON.stringify(request.body);
        return "Post " + post + " !saved!";
    }

    @Put("/posts/:id")
    put(@Req() request: Request) {
        return "Post #" + request.params.id + " has been putted!";
    }

    @Patch("/posts/:id")
    patch(@Req() request: Request) {
        return "Post #" + request.params.id + " has been patched!";
    }

    @Delete("/posts/:id")
    remove(@Req() request: Request) {
        return "Post #" + request.params.id + " has been removed!";
    }

}