import {Request} from "express";
import {Controller} from "../../src/decorator/controllers";
import {Get, Post, Put, Patch, Delete, Use} from "../../src/decorator/methods";
import {Req, Next} from "../../src/decorator/params";

@Controller()
export class UserController {


    @Use()
    middleware( @Next() next: any) {
      console.log("calling middleware");
      next();
    }

    @Get("/users", { jsonResponse: true })
    getAll() {
        return [
            { id: 1, name: "First user!" },
            { id: 2, name: "Second user!" }
        ];
    }

    @Get("/users/:id")
    getOneMdlw( @Req() request: Request, @Next() next: any) {
        console.log("calling next");
        next();
    }

    @Get("/users/:id")
    getOne( @Req() request: Request) {
        return "User #" + request.params.id;
    }

    @Post("/users")
    postmdlw( @Req() request: Request) {
        let user = JSON.stringify(request.body); // probably you want to install body-parser for express
        return "User " + user + " !saved!";
    }

    @Put("/users/:id")
    put( @Req() request: Request) {
        return "User #" + request.params.id + " has been putted!";
    }

    @Patch("/users/:id")
    patch( @Req() request: Request) {
        return "User #" + request.params.id + " has been patched!";
    }

    @Delete("/users/:id")
    remove( @Req() request: Request) {
        return "User #" + request.params.id + " has been removed!";
    }

}
