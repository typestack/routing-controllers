import {Request, Response} from "express";
import {Controller, Get, Post, Put, Patch, Delete} from "../../src/Annotations";

@Controller()
export class BlogController {

    @Get('/blogs')
    getAll(request: Request, response: Response/*, @Body() body: any, @GetParam('hello') hello: string, @PostParam('yo') yo: string*/) {
        return this.createPromise([
            { id: 1, name: 'Blog 1!'},
            { id: 2, name: 'Blog 2!'},
        ], 3000);
    }

    @Get('/blogs/:id')
    getOne(request: Request, response: Response) {
        return this.createPromise({ id: 1, name: 'Blog 1!'}, 3000);
    }

    @Post('/blogs')
    post(request: Request, response: Response) {
        let blog = JSON.stringify(request.body);
        return this.createPromise('Blog ' + blog + ' !saved!', 3000);
    }

    @Put('/blogs/:id')
    put(request: Request, response: Response) {
        return this.createPromise('Blog #' + request.params.id + ' has been putted!', 3000);
    }

    @Patch('/blogs/:id')
    patch(request: Request, response: Response) {
        return this.createPromise('Blog #' + request.params.id + ' has been patched!', 3000);
    }

    @Delete('/blogs/:id')
    remove(request: Request, response: Response) {
        return this.createPromise('Blog #' + request.params.id + ' has been removed!', 3000);
    }

    private createPromise(data: any, timeout: number): Promise<any> {
        return new Promise<any>((ok, fail) => {
            setTimeout(() => ok(data), timeout);
        });
    }

}