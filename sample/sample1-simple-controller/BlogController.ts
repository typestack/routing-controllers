import {Request, Response} from "express";
import {Controller, Get, Post, Put, Patch, Delete} from "../../src/Annotations";

@Controller()
export class BlogController {

    @Get('/blogs')
    getAll(request: Request, response: Response) {
        return [
            { id: 1, name: 'First blog!' },
            { id: 2, name: 'Second blog!' }
        ];
    }

    @Get('/blogs/:id')
    getOne(request: Request, response: Response) {
        return { id: 1, name: 'First blog!' };
    }

    @Post('/blogs')
    post(request: Request, response: Response) {
        let blog = JSON.stringify(request.body);
        return 'Blog ' + blog + ' !saved!';
    }

    @Put('/blogs/:id')
    put(request: Request, response: Response) {
        return 'Blog #' + request.params.id + ' has been putted!';
    }

    @Patch('/blogs/:id')
    patch(request: Request, response: Response) {
        return 'Blog #' + request.params.id + ' has been patched!';
    }

    @Delete('/blogs/:id')
    remove(request: Request, response: Response) {
        return 'Blog #' + request.params.id + ' has been removed!';
    }

}