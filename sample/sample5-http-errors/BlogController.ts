import {JsonController} from "../../src/decorator/JsonController";
import {Get} from "../../src/decorator/Get";
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