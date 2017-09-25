import "reflect-metadata";
import * as express from "express";
import * as bodyParser from "body-parser";
import { Container } from "typedi";
import { createExpressServer, useContainer } from "../../src";
import { ExampleController } from "./Example.controller";
import { ExampleService } from "./Example.service";
import { ExampleServiceMock } from "./Example.service.mock";

class App {

    public server: express.Application;
    public controllers: any = [
        ExampleController
    ];
    public middlewares: any = [
        bodyParser.json(),
        bodyParser.urlencoded({extended: false})
    ];
    
    constructor() {
        Container.set("example.service", new ExampleService());
        Container.set("example.service.mock", new ExampleServiceMock());
        useContainer(Container);
        this.server = createExpressServer({
            routePrefix: "/api/v1",
            controllers: this.controllers,
            middlewares: this.middlewares
        });
    }
}

export default new App().server;