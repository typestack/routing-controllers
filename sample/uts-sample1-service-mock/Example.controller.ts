import { Inject } from "typedi";
import { JsonController, Get } from "../../src";
import { Data, IService } from "./interfaces";

@JsonController("/")
export class ExampleController {

    @Inject("example.service")
    private service: IService;

    constructor() {
        
    }

    @Get()
    public helloWorld(): any {
        return "Hello world !";
    }

    @Get("all")
    public async getAllResources() {
        const toBeReturned = await this.service.getAll();
        return toBeReturned;
    }

}