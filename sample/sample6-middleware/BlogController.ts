import {Controller} from "../../src/decorator/controllers";
import {Get} from "../../src/decorator/methods";
import {ForbiddenError} from "../../src/error/http/ForbiddenError";
import {Param} from "../../src/decorator/params";

@Controller()
export class BlogController {

    @Get("/blogs", { jsonResponse: true })
    getAll() {
        console.log("hello blog");
        return [
            { id: 1, firstName: "First", secondName: "blog" },
            { id: 2, firstName: "Second", secondName: "blog" }
        ];
    }

    @Get("/blogs/:id", { jsonResponse: true })
    getOne(@Param("id") id: number) {
        if (!id)
            throw new ForbiddenError();

        return "THIS STRING will BE not SO BIG";
    }

}