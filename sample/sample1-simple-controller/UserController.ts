import {Request} from "express";
import {Controller} from "../../src/decorator/Controllers";
import {Get, Post, Put, Patch, Delete} from "../../src/decorator/Methods";
import {Req} from "../../src/decorator/Params";

@Controller()
export class UserController {

    @Get("/users", { jsonResponse: true })
    getAll() {
        return [
            { id: 1, name: "First user!" },
            { id: 2, name: "Second user!" }
        ];
    }

    @Get("/users/:id")
    getOne(@Req() request: Request) {
        return "User #" + request.params.id;
    }

    @Post("/users")
    post(@Req() request: Request) {
        let user = JSON.stringify(request.body); // probably you want to install body-parser for express
        return "User " + user + " !saved!";
    }

    @Put("/users/:id")
    put(@Req() request: Request) {
        return "User #" + request.params.id + " has been putted!";
    }

    @Patch("/users/:id")
    patch(@Req() request: Request) {
        return "User #" + request.params.id + " has been patched!";
    }

    @Delete("/users/:id")
    remove(@Req() request: Request) {
        return "User #" + request.params.id + " has been removed!";
    }

}