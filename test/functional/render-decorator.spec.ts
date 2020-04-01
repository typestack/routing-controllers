import "reflect-metadata";
import {Controller} from "../../src/decorator/Controller";
import {Get} from "../../src/decorator/Get";
import {Res} from "../../src/decorator/Res";
import {createExpressServer, getMetadataArgsStorage} from "../../src/index";
import {Render} from "../../src/decorator/Render";
import {AxiosResponse} from "axios";
import {Server as HttpServer} from "http";
import HttpStatusCodes from "http-status-codes";
import DoneCallback = jest.DoneCallback;
import express, {Application as ExpressApplication} from "express";
import mustacheExpress from "mustache-express";
import path from "path";
import {axios} from "../utilities/axios";

describe("template rendering", () => {
    let expressServer: HttpServer;

    beforeAll((done: DoneCallback) => {
        getMetadataArgsStorage().reset();

        @Controller()
        class RenderController {
            @Get("/index")
            @Render("render-test-spec.html")
            index() {
                return {
                    name: "Routing-controllers"
                };
            }

            @Get("/locals")
            @Render("render-test-locals-spec.html")
            locals(@Res() res: any) {
                res.locals.myVariable = "my-variable";

                return {
                    name: "Routing-controllers"
                };
            }
        }

        const resourcePath: string = path.resolve(__dirname, "../resources");
        let expressApplication: ExpressApplication = createExpressServer();
        expressApplication.engine("html", mustacheExpress());
        expressApplication.set("view engine", "html");
        expressApplication.set("views", resourcePath);
        expressApplication.use(express.static(resourcePath));
        expressServer = expressApplication.listen(3001, done);
    });

    afterAll((done: DoneCallback) => expressServer.close(done));

    it("should render a template and use given variables", () => {
        expect.assertions(6);
        return axios.get("/index")
            .then((response: AxiosResponse) => {
                expect(response.status).toEqual(HttpStatusCodes.OK);
                expect(response.data).toContain("<html>");
                expect(response.data).toContain("<body>");
                expect(response.data).toContain("Routing-controllers");
                expect(response.data).toContain("</body>");
                expect(response.data).toContain("</html>");
            });
    });

    it("should render a template with given variables and locals variables", () => {
        expect.assertions(7);
        return axios.get("/locals")
            .then((response: AxiosResponse) => {
                expect(response.status).toEqual(HttpStatusCodes.OK);
                expect(response.data).toContain("<html>");
                expect(response.data).toContain("<body>");
                expect(response.data).toContain("Routing-controllers");
                expect(response.data).toContain("my-variable");
                expect(response.data).toContain("</body>");
                expect(response.data).toContain("</html>");
            });
    });
});
