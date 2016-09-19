import "reflect-metadata";
import {Request} from "express";
import {Controller} from "../../src/decorator/controllers";
import {Get, Post, Put, Patch, Delete} from "../../src/decorator/methods";
import {Session, Req, Param} from "../../src/decorator/params";
import {JsonResponse} from "../../src/decorator/decorators";

@Controller()
export class UserController {

    @Get("/users")
    @JsonResponse()
    getAll() {
        return [
            { id: 1, name: "First user!" },
            { id: 2, name: "Second user!" }
        ];
    }

    @Get("/users/:id")
    @JsonResponse()
    getOne(@Session("user") user: any) {
        return user;
    }

    @Post("/users")
    post(@Req() request: Request) {
        let user = JSON.stringify(request.body); // probably you want to install body-parser for express
        return "User " + user + " !saved!";
    }

    @Put("/users/:id")
    put(@Param("id") id: number, @Session() session: Express.Session) {
        (session as any).user = { name: "test", number: id };
        return "User has been putted!";
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