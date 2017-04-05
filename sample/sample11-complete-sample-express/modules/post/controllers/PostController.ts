import {Request} from "express";
import {JsonController} from "../../../../../src/deprecated/JsonController";
import {Get, Post, Put, Patch, Delete} from "../../../../../src/decorator/Method";
import {Req} from "../../../../../src/decorator/UploadedFiles";

@JsonController()
export class PostController {

    @Get("/posts")
    getAll() {
        return this.createPromise([
            { id: 1, name: "Post 1!"},
            { id: 2, name: "Post 2!"},
        ], 3000);
    }

    @Get("/posts/:id")
    getOne() {
        return this.createPromise({ id: 1, name: "Post 1!"}, 3000);
    }

    @Post("/posts")
    post(@Req() request: Request) {
        let post = JSON.stringify(request.body);
        return this.createPromise("Post " + post + " !saved!", 3000);
    }

    @Put("/posts/:id")
    put(@Req() request: Request) {
        return this.createPromise("Post #" + request.params.id + " has been putted!", 3000);
    }

    @Patch("/posts/:id")
    patch(@Req() request: Request) {
        return this.createPromise("Post #" + request.params.id + " has been patched!", 3000);
    }

    @Delete("/posts/:id")
    remove(@Req() request: Request) {
        return this.createPromise("Post #" + request.params.id + " has been removed!", 3000);
    }

    private createPromise(data: any, timeout: number): Promise<any> {
        return new Promise<any>((ok, fail) => {
            setTimeout(() => ok(data), timeout);
        });
    }

}