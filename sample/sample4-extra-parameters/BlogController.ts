import {Request, Response} from "express";
import {JsonController, Get, Post, Put, Patch, Delete, Body, QueryParam, Param} from "../../src/Annotations";

interface BlogFilter {
    keyword: string;
    limit: number;
    offset: number;
}

@JsonController()
export class BlogController {

    @Get('/blogs')
    getAll(@QueryParam('filter', { required: true, parseJson: true }) filter: BlogFilter) {
        console.log(filter.keyword);
        return [
            { id: 1, name: 'Blog 1!'},
            { id: 2, name: 'Blog 2!'}
        ];
    }

    @Get('/blogs/:id')
    getOne(@Param('id') id: number, @QueryParam('name') name: string) {
        return { id: id, name: name };
    }

    @Post('/blogs')
    post(@Body() blog: any) {
        return 'Blog ' + JSON.stringify(blog) + ' !saved!';
    }

    @Put('/blogs/:id')
    put(@Param('id') id: number) {
        return 'Blog #' + id + ' has been putted!';
    }

    @Patch('/blogs/:id')
    patch(@Param('id') id: number) {
        return 'Blog #' + id + ' has been patched!';
    }

    @Delete('/blogs/:id')
    remove(@Param('id') id: number) {
        return 'Blog #' + id + ' has been removed!';
    }


}