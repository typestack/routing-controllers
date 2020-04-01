import "reflect-metadata";
import {createExpressServer, getMetadataArgsStorage} from "../../src/index";
import {defaultFakeService} from "../fakes/global-options/FakeService";
import {Controller} from "../../src/decorator/Controller";
import {Get} from "../../src/decorator/Get";
import {AxiosError, AxiosResponse} from "axios";
import {Server as HttpServer} from "http";
import HttpStatusCodes from "http-status-codes";
import DoneCallback = jest.DoneCallback;
import {axios} from "../utilities/axios";

describe("loading all controllers from the given directories", () => {
    let expressServer: HttpServer;

    beforeAll((done: DoneCallback) => {
        getMetadataArgsStorage().reset();
        expressServer = createExpressServer({
            controllers: [
                __dirname + "/../fakes/global-options/first-controllers/**/*{.js,.ts}",
                __dirname + "/../fakes/global-options/second-controllers/*{.js,.ts}"
            ]
        }).listen(3001, done);
    });

    afterAll((done: DoneCallback) => expressServer.close(done));

    it("should load all controllers", () => {
        expect.assertions(10);
        return Promise.all<AxiosResponse | void>([
            axios.get("/posts")
                .then((response: AxiosResponse) => {
                    expect(response.status).toEqual(HttpStatusCodes.OK);
                    expect(response.data).toEqual([{id: 1, title: "#1"}, {id: 2, title: "#2"}]);
                }),
            axios.get("/questions")
                .then((response: AxiosResponse) => {
                    expect(response.status).toEqual(HttpStatusCodes.OK);
                    expect(response.data).toEqual([{id: 1, title: "#1"}, {id: 2, title: "#2"}]);
                }),
            axios.get("/answers")
                .then((response: AxiosResponse) => {
                    expect(response.status).toEqual(HttpStatusCodes.OK);
                    expect(response.data).toEqual([{id: 1, title: "#1"}, {id: 2, title: "#2"}]);
                }),
            axios.get("/photos")
                .then((response: AxiosResponse) => {
                    expect(response.status).toEqual(HttpStatusCodes.OK);
                    expect(response.data).toEqual("Hello photos");
                }),
            axios.get("/videos")
                .then((response: AxiosResponse) => {
                    expect(response.status).toEqual(HttpStatusCodes.OK);
                    expect(response.data).toEqual("Hello videos");
                })
        ]);
    });
});

describe("loading all express middlewares and error handlers from the given directories", () => {
    let expressServer: HttpServer;

    beforeAll((done: DoneCallback) => {
        getMetadataArgsStorage().reset();

        @Controller()
        class ExpressMiddlewareDirectoriesController {
            @Get("/publications")
            publications(): any[] {
                return [];
            }

            @Get("/articles")
            articles(): any[] {
                throw new Error("Cannot load articles");
            }
        }

        expressServer = createExpressServer({
            middlewares: [
                __dirname + "/../fakes/global-options/express-middlewares/**/*{.js,.ts}"
            ],
        }).listen(3001, done);
    });

    afterAll((done: DoneCallback) => expressServer.close(done));

    beforeEach(() => defaultFakeService.reset());

    it("should succeed", () => {
        expect.assertions(6);
        return axios.get("/publications")
            .then((response: AxiosResponse) => {
                expect(response.status).toEqual(HttpStatusCodes.OK);
                expect(defaultFakeService.postMiddlewareCalled).toBeTruthy();
                expect(defaultFakeService.questionMiddlewareCalled).toBeTruthy();
                expect(defaultFakeService.questionErrorMiddlewareCalled).toBeFalsy();
                expect(defaultFakeService.fileMiddlewareCalled).toBeFalsy();
                expect(defaultFakeService.videoMiddlewareCalled).toBeFalsy();
            });
    });

    it("should fail", () => {
        expect.assertions(6)
        return axios.get("/articles")
            .catch((error: AxiosError) => {
                expect(error.response.status).toEqual(HttpStatusCodes.INTERNAL_SERVER_ERROR);
                expect(defaultFakeService.postMiddlewareCalled).toBeTruthy();
                expect(defaultFakeService.questionMiddlewareCalled).toBeTruthy();
                expect(defaultFakeService.questionErrorMiddlewareCalled).toBeTruthy();
                expect(defaultFakeService.fileMiddlewareCalled).toBeFalsy();
                expect(defaultFakeService.videoMiddlewareCalled).toBeFalsy();
            });
    })
});
