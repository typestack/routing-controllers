import {JsonController} from "../../src/decorator/JsonController";
import {Get} from "../../src/decorator/Get";
import {PathParam} from "../../src/decorator/PathParam";
import {CompressionMiddleware} from "./CompressionMiddleware";
import {AllControllerActionsMiddleware} from "./AllControllerActionsMiddleware";
import {UseBefore} from "../../src/decorator/UseBefore";

@JsonController()
@UseBefore(AllControllerActionsMiddleware)
export class BlogController {

    @Get("/blogs")
    @UseBefore(CompressionMiddleware)
    @UseBefore((request: any, response: any, next: Function) => {
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
    getOne(@PathParam("id") id: number) {
        return  { id: id, firstName: "First", secondName: "blog" };
    }

}