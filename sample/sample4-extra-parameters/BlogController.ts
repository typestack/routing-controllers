import {JsonController} from "../../src/decorator/JsonController";
import {Get} from "../../src/decorator/Get";
import {Post} from "../../src/decorator/Post";
import {Put} from "../../src/decorator/Put";
import {Patch} from "../../src/decorator/Patch";
import {Delete} from "../../src/decorator/Delete";
import {QueryParam} from "../../src/decorator/QueryParam";
import {PathParam} from "../../src/decorator/PathParam";
import {Body} from "../../src/decorator/Body";

export interface BlogFilter {
    keyword: string;
    limit: number;
    offset: number;
}

@JsonController()
export class BlogController {

    @Get("/blogs")
    getAll(@QueryParam("filter", { required: true, parse: true }) filter: BlogFilter) {
        return [
            { id: 1, name: "Blog " + filter.keyword },
            { id: 2, name: "Blog " + filter.keyword }
        ];
    }

    @Get("/blogs/:id")
    getOne(@PathParam("id") id: number, @QueryParam("name") name: string) {
        return { id: id, name: name };
    }

    @Post("/blogs")
    post(@Body() blog: any) {
        return "Blog " + JSON.stringify(blog) + " !saved!";
    }

    @Put("/blogs/:id")
    put(@PathParam("id") id: number) {
        return "Blog #" + id + " has been putted!";
    }

    @Patch("/blogs/:id")
    patch(@PathParam("id") id: number) {
        return "Blog #" + id + " has been patched!";
    }

    @Delete("/blogs/:id")
    remove(@PathParam("id") id: number) {
        return "Blog #" + id + " has been removed!";
    }

}