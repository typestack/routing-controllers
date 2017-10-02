import {Request} from "express";
import {Get} from "../../../src/decorator/Get";
import {Req} from "../../../src/index";
import {Post} from "../../../src/decorator/Post";
import {Put} from "../../../src/decorator/Put";
import {Patch} from "../../../src/decorator/Patch";
import {Delete} from "../../../src/decorator/Delete";

export class BaseControllerClass {
    name: string;
    constructor(name: string) {
        this.name = name;
    }

    @Get()
    getAll() {
        return [
            {id: 1, name: `First ${this.name}!`},
            {id: 2, name: `Second ${this.name}!`}
        ];
    }

    @Get("/:id")
    getOne() {
        return {id: 1, name: `First ${this.name}!`};
    }

    @Post("")
    post(@Req() request: Request) {
        let entity = JSON.stringify(request.body);
        return `${this.name}  ${entity} !saved!`;
    }

    @Put("/:id")
    put(@Req() request: Request) {
        return `${this.name} # ${request.params.id} has been putted!`;
    }

    @Patch("/:id")
    patch(@Req() request: Request) {
        return `${this.name} # ${request.params.id} has been patched!`;
    }

    @Delete("/:id")
    remove(@Req() request: Request) {
        return `${this.name} # ${request.params.id} has been removed!`;
    }
}

export function BaseController(name: string): { new(): BaseControllerClass } {
    return class extends BaseControllerClass {
        constructor() {
            super(name);
        }
    };
}