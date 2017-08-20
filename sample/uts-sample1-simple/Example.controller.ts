import { JsonController, Get } from "routing-controllers";

@JsonController("/")
export class ExampleController {

    @Get()
    public helloWorld(): any {
        return "Hello world !";
    }

}