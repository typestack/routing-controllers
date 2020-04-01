import "reflect-metadata";
import {Get} from "../../src/decorator/Get";
import {createExpressServer, getMetadataArgsStorage} from "../../src/index";
import {Redirect} from "../../src/decorator/Redirect";
import {JsonController} from "../../src/decorator/JsonController";
import {Param} from "../../src/decorator/Param";
import {AxiosResponse} from "axios";
import {Server as HttpServer} from "http";
import HttpStatusCodes from "http-status-codes";
import DoneCallback = jest.DoneCallback;
import {axios} from "../utilities/axios";

describe("dynamic redirect", function () {
    let expressServer: HttpServer;

    beforeAll((done: DoneCallback) => {
        getMetadataArgsStorage().reset();

        @JsonController("/users")
        class TestController {
            @Get("/:id")
            async getOne(@Param("id") id: string) {
                return {
                    login: id
                };
            }
        }

        @JsonController()
        class RedirectController {
            @Get("/template")
            @Redirect("/users/:owner")
            template() {
                return {owner: "pleerock", repo: "routing-controllers"};
            }

            @Get("/original")
            @Redirect("/users/pleerock")
            original() {
            }

            @Get("/override")
            @Redirect("https://api.github.com")
            override() {
                return "/users/pleerock";
            }
        }

        expressServer = createExpressServer().listen(3001, done);
    });

    afterAll((done: DoneCallback) => expressServer.close(done));

    it("using template", () => {
        expect.assertions(2);
        return axios.get("/template")
            .then((response: AxiosResponse) => {
                expect(response.status).toEqual(HttpStatusCodes.OK);
                expect(response.data.login).toEqual("pleerock");
            });
    });

    it("using override", () => {
        expect.assertions(2);
        return axios.get("/override")
            .then((response: AxiosResponse) => {
                expect(response.status).toEqual(HttpStatusCodes.OK);
                expect(response.data.login).toEqual("pleerock");
            });
    });

    it("using original", () => {
        expect.assertions(2);
        return axios.get("/original")
            .then((response: AxiosResponse) => {
                expect(response.status).toEqual(HttpStatusCodes.OK);
                expect(response.data.login).toEqual("pleerock");
            });
    });
});
