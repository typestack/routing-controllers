import {Request} from "express";
import {JsonController} from "../../../../../src/decorator/JsonController";
import {Get, Post, Put, Patch, Delete} from "../../../../../src/decorator/Method";
import {Req, Param} from "../../../../../src/decorator/UploadedFiles";

@JsonController()
export class QuestionController {

    @Get("/questions")
    getAll() {
        return this.createPromise([
            { id: 1, name: "Question 1!"},
            { id: 2, name: "Question 2!"},
        ], 3000);
    }

    @Get("/questions/:id")
    getOne(@Param("id") id: number) {
        if (!id)
            return Promise.reject(new Error("No id is specified"));
        
        return this.createPromise({ id: 1, name: "Question 1!"}, 3000);
    }

    @Post("/questions")
    post(@Req() request: Request) {
        let question = JSON.stringify(request.body);
        return this.createPromise("Question " + question + " !saved!", 3000);
    }

    @Put("/questions/:id")
    put(@Req() request: Request) {
        return this.createPromise("Question #" + request.params.id + " has been putted!", 3000);
    }

    @Patch("/questions/:id")
    patch(@Req() request: Request) {
        return this.createPromise("Question #" + request.params.id + " has been patched!", 3000);
    }

    @Delete("/questions/:id")
    remove(@Req() request: Request) {
        return this.createPromise("Question #" + request.params.id + " has been removed!", 3000);
    }

    private createPromise(data: any, timeout: number): Promise<any> {
        return new Promise<any>((ok, fail) => {
            setTimeout(() => ok(data), timeout);
        });
    }

}