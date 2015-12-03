import {Controller, Get, Post, Put, Patch, Delete, Body, QueryParam, Param} from "controllers.ts/Decorators";
import {ForbiddenError} from "controllers.ts/error/http/ForbiddenError";

@Controller()
export class BlogController {

    @Get('/blogs', { jsonResponse: true })
    getAll() {
        return [
            { id: 1, firstName: 'First', secondName: 'blog' },
            { id: 2, firstName: 'Second', secondName: 'blog' }
        ];
    }

    @Get('/blogs/:id')
    getOne() {
        return 'THIS STRING will BE not SO BIG';
    }

}