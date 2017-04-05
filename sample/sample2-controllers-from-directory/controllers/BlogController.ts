import {Request} from "express";
import {Get, Post, Put, Patch, Delete} from "../../../src/decorator/Method";
import {Req} from "../../../src/decorator/UploadedFiles";
import {JsonController} from "../../../src/decorator/JsonController";

@JsonController()
export class BlogController {

    @Get("/blogs")
    getAll() {
        return [
            { id: 1, name: "First blog!" },
            { id: 2, name: "Second blog!" }
        ];
    }

    @Get("/blogs/:id")
    getOne() {
        return { id: 1, name: "First blog!" };
    }

    @Post("/blogs")
    post(@Req() request: Request) {
        let blog = JSON.stringify(request.body);
        return "Blog " + blog + " !saved!";
    }

    @Put("/blogs/:id")
    put(@Req() request: Request) {
        return "Blog #" + request.params.id + " has been putted!";
    }

    @Patch("/blogs/:id")
    patch(@Req() request: Request) {
        return "Blog #" + request.params.id + " has been patched!";
    }

    @Delete("/blogs/:id")
    remove(@Req() request: Request) {
        return "Blog #" + request.params.id + " has been removed!";
    }

}