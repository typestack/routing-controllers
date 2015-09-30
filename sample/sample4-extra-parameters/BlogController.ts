import {Request, Response} from "express";
import {Controller, Get, Post, Put, Patch, Delete, Body, QueryParam, Param} from "../../src/Annotations";

interface BlogFilter {
    keyword: string;
    limit: number;
    offset: number;
}

@Controller()
export class BlogController {

    @Get('/blogs')
    getAll(request: Request, response: Response, @QueryParam('filter', true) filter: BlogFilter) {
        console.log(filter.keyword);
        return [
            { id: 1, name: 'Blog 1!'},
            { id: 2, name: 'Blog 2!'}
        ];
    }

    @Get('/blogs/:id')
    getOne(request: Request, response: Response, @Param('id') id: number, @QueryParam('name') name: string) {
        return { id: id, name: name };
    }

    @Post('/blogs')
    post(request: Request, response: Response, @Body() blog: any) {
        return 'Blog ' + JSON.stringify(blog) + ' !saved!';
    }

    @Put('/blogs/:id')
    put(request: Request, response: Response, @Param('id') id: number) {
        return 'Blog #' + id + ' has been putted!';
    }

    @Patch('/blogs/:id')
    patch(request: Request, response: Response, @Param('id') id: number) {
        return 'Blog #' + id + ' has been patched!';
    }

    @Delete('/blogs/:id')
    remove(request: Request, response: Response, @Param('id') id: number) {
        return 'Blog #' + id + ' has been removed!';
    }


}