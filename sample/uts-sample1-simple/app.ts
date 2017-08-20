import "reflect-metadata";
import { createExpressServer } from "../../src";
import { ExampleController } from "./Example.controller";

const app = createExpressServer({
    routePrefix: "/api/v1",
    controllers: [ExampleController]
});

// run express application on port 3000
const server = app.listen(3000);

export { server }