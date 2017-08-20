import { JsonController, Get } from "../../src";

@JsonController("/")
export class ExampleController {

    @Get()
    public helloWorld(): any {
        return "Hello world !";
    }

}