import {JsonController} from "../../src/decorator/JsonController";
import {Get} from "../../src/decorator/Get";
import {Param} from "../../src/decorator/Param";
import {CompressionMiddleware} from "./CompressionMiddleware";
import {AllControllerActionsMiddleware} from "./AllControllerActionsMiddleware";
import {Use} from "../../src/decorator/Use";

@JsonController()
@Use(AllControllerActionsMiddleware)
export class BlogController {

    @Get("/blogs")
    @Use(CompressionMiddleware)
    @Use((request: any, response: any, next: Function) => {
        console.log("wow middleware");
        next();
    })
    getAll() {
        console.log("hello blog");
        return [
            { id: 1, firstName: "First", secondName: "blog" },
            { id: 2, firstName: "Second", secondName: "blog" }
        ];
    }

    @Get("/blogs/:id")
    getOne(@Param("id") id: number) {
        return  { id: id, firstName: "First", secondName: "blog" };
    }

}