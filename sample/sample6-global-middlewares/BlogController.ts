import {ForbiddenError} from "../../src/http-error/ForbiddenError";
import {Controller} from "../../src/decorator/Controller";
import {Get} from "../../src/decorator/Get";
import {PathParam} from "../../src/decorator/PathParam";
import {ContentType} from "../../src/decorator/ContentType";

@Controller()
export class BlogController {

    @Get("/blogs")
    @ContentType("application/json")
    getAll() {
        console.log("hello blog");
        return [
            { id: 1, firstName: "First", secondName: "blog" },
            { id: 2, firstName: "Second", secondName: "blog" }
        ];
    }

    @Get("/blogs/:id")
    @ContentType("application/json")
    getOne(@PathParam("id") id: number) {
        if (!id)
            throw new ForbiddenError();

        return "THIS STRING will BE not SO BIG";
    }

}