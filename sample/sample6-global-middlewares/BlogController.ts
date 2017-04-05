import {Controller} from "../../src/decorator/JsonController";
import {Get} from "../../src/decorator/Method";
import {ForbiddenError} from "../../src/http-error/ForbiddenError";
import {Param} from "../../src/decorator/UploadedFiles";
import {JsonResponse} from "../../src/decorator/JsonResponse";

@Controller()
export class BlogController {

    @Get("/blogs")
    @JsonResponse()
    getAll() {
        console.log("hello blog");
        return [
            { id: 1, firstName: "First", secondName: "blog" },
            { id: 2, firstName: "Second", secondName: "blog" }
        ];
    }

    @Get("/blogs/:id")
    @JsonResponse()
    getOne(@Param("id") id: number) {
        if (!id)
            throw new ForbiddenError();

        return "THIS STRING will BE not SO BIG";
    }

}