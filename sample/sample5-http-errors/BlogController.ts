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
import {ForbiddenError} from "../../src/http-error/ForbiddenError";

export class ValidationError extends Error {
    name = "ValidationError";
    message = "Validation Error!";
    errors = [
        "blank",
        "minLength",
        "maxLength",
    ];
}

@JsonController()
export class BlogController {

    @Get("/blogs")
    getAll() {
        throw new ForbiddenError("Nooooo this message will be lost");
    }

    @Get("/blogs/:id")
    getOne() {
        throw new ValidationError();
    }

}