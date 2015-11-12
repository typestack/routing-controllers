import {Request, Response} from "express";
import {JsonController, Get, Post, Put, Patch, Delete, Req} from "../../src/Annotations";
import {NotFoundError} from "../../src/error/http/NotFoundError";

@JsonController()
export class BlogController {

    @Get('/blogs')
    getAll() {
        return this.createPromise([
            { id: 1, name: 'Blog 1!'},
            { id: 2, name: 'Blog 2!'},
        ], 3000);
    }

    @Get('/blogs/:id')
    getOne() {
        return this.createPromise({ id: 1, name: 'Blog 1!'}, 3000);
    }

    @Post('/blogs')
    post(@Req() request: Request) {
        let blog = JSON.stringify(request.body);
        return this.createPromise('Blog ' + blog + ' !saved!', 3000);
    }

    @Put('/blogs/:id')
    put(@Req() request: Request) {
        return this.createPromise('Blog #' + request.params.id + ' has been putted!', 3000);
    }

    @Patch('/blogs/:id')
    patch(@Req() request: Request) {
        return this.createPromise('Blog #' + request.params.id + ' has been patched!', 3000);
    }

    @Delete('/blogs/:id')
    remove(@Req() request: Request) {
        return this.createPromise('Blog #' + request.params.id + ' has been removed!', 3000);
    }

    private createPromise(data: any, timeout: number): Promise<any> {
        return new Promise<any>((ok, fail) => {
            setTimeout(() => ok(data), timeout);
        });
    }

}