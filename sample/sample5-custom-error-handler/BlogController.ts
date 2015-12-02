import {JsonController, Get, Post, Put, Patch, Delete, Body, QueryParam, Param} from "../../src/Decorators";
import {ForbiddenError} from "../../src/error/http/ForbiddenError";

export class ValidationError extends Error {
    name = 'ValidationError';
    message = 'Validation Error!';
    errors = [
        'blank',
        'minLength',
        'maxLength',
    ];
}

@JsonController()
export class BlogController {

    @Get('/blogs')
    getAll() {
        //throw new ValidationError();
        throw new ForbiddenError('Nooooo this message will be lost');
    }

    @Get('/blogs/:id')
    getOne() {
        throw new ValidationError();
    }

}