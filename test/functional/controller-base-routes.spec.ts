import "reflect-metadata";
import {createExpressServer, getMetadataArgsStorage} from "../../src/index";
import {Controller} from "../../src/decorator/Controller";
import {Get} from "../../src/decorator/Get";
import DoneCallback = jest.DoneCallback;
import {AxiosError, AxiosResponse} from "axios";
import {Server as HttpServer} from "http";
import HttpStatusCodes from "http-status-codes";
import {axios} from "../utilities/axios";

describe("controller > base routes functionality", () => {
    let expressServer: HttpServer;

    beforeEach((done: DoneCallback) => {
        getMetadataArgsStorage().reset();

        @Controller("/posts")
        class PostController {
            @Get("/")
            getAll() {
                return "<html><body>All posts</body></html>";
            }

            @Get("/:id(\\d+)")
            getUserById() {
                return "<html><body>One post</body></html>";
            }

            @Get(/\/categories\/(\d+)/)
            getCategoryById() {
                return "<html><body>One post category</body></html>";
            }

            @Get("/:postId(\\d+)/users/:userId(\\d+)")
            getPostById() {
                return "<html><body>One user</body></html>";
            }
        }

        expressServer = createExpressServer().listen(3001, done);
    });

    afterEach((done: DoneCallback) => expressServer.close(done));

    it("get should respond with proper status code, headers and body content", () => {
        expect.assertions(3);
        return axios.get("/posts")
            .then((response: AxiosResponse) => {
                expect(response.status).toEqual(HttpStatusCodes.OK);
                expect(response.headers["content-type"]).toEqual("text/html; charset=utf-8");
                expect(response.data).toEqual("<html><body>All posts</body></html>");
            });
    });

    it("get should respond with proper status code, headers and body content", () => {
        expect.assertions(3);
        return axios.get("/posts/1")
            .then((response: AxiosResponse) => {
                expect(response.status).toEqual(HttpStatusCodes.OK);
                expect(response.headers["content-type"]).toEqual("text/html; charset=utf-8");
                expect(response.data).toEqual("<html><body>One post</body></html>");
            });
    });

    it("get should respond with proper status code, headers and body content", () => {
        expect.assertions(3);
        return axios.get("posts/1/users/2")
            .then((response: AxiosResponse) => {
                expect(response.status).toEqual(HttpStatusCodes.OK);
                expect(response.headers["content-type"]).toEqual("text/html; charset=utf-8");
                expect(response.data).toEqual("<html><body>One user</body></html>");
            });
    });

    it("wrong route should respond with 404 error", () => {
        expect.assertions(1);
        return axios.get("/1/users/1")
            .catch((error: AxiosError) => {
                expect(error.response.status).toEqual(HttpStatusCodes.NOT_FOUND);
            });
    });

    it("wrong route should respond with 404 error", () => {
        expect.assertions(1);
        return axios.get("/categories/1")
            .catch((error: AxiosError) => {
                expect(error.response.status).toEqual(HttpStatusCodes.NOT_FOUND);
            });
    });

    it("wrong route should respond with 404 error", () => {
        expect.assertions(1);
        return axios.get("/users/1")
            .catch((error: AxiosError) => {
                expect(error.response.status).toEqual(HttpStatusCodes.NOT_FOUND);
            });
    });
});
