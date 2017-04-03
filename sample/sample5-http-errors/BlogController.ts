import {JsonController} from "../../src/decorator/controllers";
import {Get} from "../../src/decorator/methods";
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