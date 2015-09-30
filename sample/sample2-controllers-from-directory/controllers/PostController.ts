import {Request, Response} from "express";
import {Controller, Get, Post, Put, Patch, Delete} from "../../../src/Annotations";

@Controller()
export class PostController {

    @Get('/posts')
    getAll(request: Request, response: Response) {
        return [
            { id: 1, name: 'First post!' },
            { id: 2, name: 'Second post!' }
        ];
    }

    @Get('/posts/:id')
    getOne(request: Request, response: Response) {
        return { id: 1, name: 'First post!' };
    }

    @Post('/posts')
    post(request: Request, response: Response) {
        let post = JSON.stringify(request.body);
        return 'Post ' + post + ' !saved!';
    }

    @Put('/posts/:id')
    put(request: Request, response: Response) {
        return 'Post #' + request.params.id + ' has been putted!';
    }

    @Patch('/posts/:id')
    patch(request: Request, response: Response) {
        return 'Post #' + request.params.id + ' has been patched!';
    }

    @Delete('/posts/:id')
    remove(request: Request, response: Response) {
        return 'Post #' + request.params.id + ' has been removed!';
    }

}