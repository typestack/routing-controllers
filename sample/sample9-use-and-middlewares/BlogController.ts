import {JsonController} from "../../src/deprecated/JsonController";
import {JsonResponse} from "../../src/deprecated/JsonResponse";
import {Controller} from "../../src/decorator/Controller";
import {Get} from "../../src/decorator/Get";
import {Req} from "../../src/index";
import {Post} from "../../src/decorator/Post";
import {Put} from "../../src/decorator/Put";
import {Patch} from "../../src/decorator/Patch";
import {Delete} from "../../src/decorator/Delete";
import {QueryParam} from "../../src/decorator/QueryParam";
import {Param} from "../../src/decorator/Param";
import {Body} from "../../src/decorator/Body";
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
    getOne(@Param("id") id: number) {
        return  { id: id, firstName: "First", secondName: "blog" };
    }

}