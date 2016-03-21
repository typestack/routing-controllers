import {JsonController} from "../../src/decorator/Controllers";
import {Get} from "../../src/decorator/Methods";
import {ForbiddenError} from "../../src/error/http/ForbiddenError";

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