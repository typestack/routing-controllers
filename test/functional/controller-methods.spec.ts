import "reflect-metadata";
import {Controller} from "../../src/decorator/Controller";
import {Get} from "../../src/decorator/Get";
import {Post} from "../../src/decorator/Post";
import {Method} from "../../src/decorator/Method";
import {Head} from "../../src/decorator/Head";
import {Delete} from "../../src/decorator/Delete";
import {Patch} from "../../src/decorator/Patch";
import {Put} from "../../src/decorator/Put";
import {ContentType} from "../../src/decorator/ContentType";
import {JsonController} from "../../src/decorator/JsonController";
import {UnauthorizedError} from "../../src/http-error/UnauthorizedError";
import {createExpressServer, getMetadataArgsStorage} from "../../src/index";
import {AxiosError, AxiosResponse} from "axios";
import {Server as HttpServer} from "http";
import HttpStatusCodes from "http-status-codes";
import DoneCallback = jest.DoneCallback;
import {axios} from "../utilities/axios";

describe("controller methods", () => {
    let expressServer: HttpServer;

    beforeAll((done: DoneCallback) => {
        getMetadataArgsStorage().reset();

        @Controller()
        class UserController {
            @Get("/users")
            getAll(): string {
                return "<html><body>All users</body></html>";
            }

            @Post("/users")
            post(): string {
                return "<html><body>Posting user</body></html>";
            }

            @Put("/users")
            put(): string {
                return "<html><body>Putting user</body></html>";
            }

            @Patch("/users")
            patch(): string {
                return "<html><body>Patching user</body></html>";
            }

            @Delete("/users")
            delete(): string {
                return "<html><body>Removing user</body></html>";
            }

            @Head("/users")
            head(): string {
                return "<html><body>Removing user</body></html>";
            }

            @Method("post", "/categories")
            postCategories(): string {
                return "<html><body>Posting categories</body></html>";
            }

            @Method("delete", "/categories")
            getCategories(): string {
                return "<html><body>Get categories</body></html>";
            }

            @Get("/users/:id")
            getUserById(): string {
                return "<html><body>One user</body></html>";
            }

            @Get(/\/categories\/[\d+]/)
            getCategoryById(): string {
                return "<html><body>One category</body></html>";
            }

            @Get("/posts/:id(\\d+)")
            getPostById(): string {
                return "<html><body>One post</body></html>";
            }

            @Get("/posts-from-db")
            getPostFromDb(): Promise<string> {
                return new Promise((ok, fail) => {
                    setTimeout(() => {
                        ok("<html><body>resolved after half second</body></html>");
                    }, 500);
                });
            }

            @Get("/posts-from-failed-db")
            getPostFromFailedDb(): Promise<string> {
                return new Promise((ok, fail) => {
                    setTimeout(() => {
                        fail("<html><body>cannot connect to a database</body></html>");
                    }, 500);
                });
            }
        }

        @JsonController("/return/json")
        class ReturnJsonController {
            @Get("/undefined")
            returnUndefined(): undefined {
                return undefined;
            }

            @Get("/null")
            returnNull(): null {
                return null;
            }
        }

        @Controller("/return/normal")
        class ReturnNormalController {
            @Get("/undefined")
            returnUndefined(): undefined {
                return undefined;
            }

            @Get("/null")
            returnNull(): null {
                return null;
            }
        }

        @JsonController("/json-controller")
        class ContentTypeController {
            @Get("/text-html")
            @ContentType("text/html")
            returnHtml(): string {
                return "<html>Test</html>";
            }

            @Get("/text-plain")
            @ContentType("text/plain")
            returnString(): string {
                return "Test";
            }

            @Get("/text-plain-error")
            @ContentType("text/plain")
            textError(): never {
                throw new UnauthorizedError();
            }

            @Get("/json-error")
            jsonError(): never {
                throw new UnauthorizedError();
            }
        }

        expressServer = createExpressServer().listen(3001, done);
    });

    afterAll((done: DoneCallback) => expressServer.close(done));

    it("get should respond with proper status code, headers and body content", () => {
        expect.assertions(3);
        return axios.get("/users")
            .then((response: AxiosResponse) => {
                expect(response.status).toEqual(HttpStatusCodes.OK);
                expect(response.headers["content-type"]).toEqual("text/html; charset=utf-8");
                expect(response.data).toEqual("<html><body>All users</body></html>");
            });
    });

    it("post respond with proper status code, headers and body content", () => {
        expect.assertions(3);
        return axios.post("/users")
            .then((response: AxiosResponse) => {
                expect(response.status).toEqual(HttpStatusCodes.OK);
                expect(response.headers["content-type"]).toEqual("text/html; charset=utf-8");
                expect(response.data).toEqual("<html><body>Posting user</body></html>");
            });
    });

    it("put respond with proper status code, headers and body content", () => {
        expect.assertions(3);
        return axios.put("/users")
            .then((response: AxiosResponse) => {
                expect(response.status).toEqual(HttpStatusCodes.OK);
                expect(response.headers["content-type"]).toEqual("text/html; charset=utf-8");
                expect(response.data).toEqual("<html><body>Putting user</body></html>");
            });
    });

    it("patch respond with proper status code, headers and body content", () => {
        expect.assertions(3);
        return axios.patch("/users")
            .then((response: AxiosResponse) => {
                expect(response.status).toEqual(HttpStatusCodes.OK);
                expect(response.headers["content-type"]).toEqual("text/html; charset=utf-8");
                expect(response.data).toEqual("<html><body>Patching user</body></html>");
            });
    });

    it("delete respond with proper status code, headers and body content", () => {
        expect.assertions(3);
        return axios.delete("/users")
            .then((response: AxiosResponse) => {
                expect(response.status).toEqual(HttpStatusCodes.OK);
                expect(response.headers["content-type"]).toEqual("text/html; charset=utf-8");
                expect(response.data).toEqual("<html><body>Removing user</body></html>");
            });
    });

    it("head respond with proper status code, headers and body content", () => {
        expect.assertions(3);
        return axios.head("/users")
            .then((response: AxiosResponse) => {
                expect(response.status).toEqual(HttpStatusCodes.OK);
                expect(response.headers["content-type"]).toEqual("text/html; charset=utf-8");
                expect(response.data).toEqual("");
            });
    });

    it("custom method (post) respond with proper status code, headers and body content", () => {
        expect.assertions(3);
        return axios.post("/categories")
            .then((response: AxiosResponse) => {
                expect(response.status).toEqual(HttpStatusCodes.OK);
                expect(response.headers["content-type"]).toEqual("text/html; charset=utf-8");
                expect(response.data).toEqual("<html><body>Posting categories</body></html>");
            });
    });

    it("custom method (delete) respond with proper status code, headers and body content", () => {
        expect.assertions(3);
        return axios.delete("/categories")
            .then((response: AxiosResponse) => {
                expect(response.status).toEqual(HttpStatusCodes.OK);
                expect(response.headers["content-type"]).toEqual("text/html; charset=utf-8");
                expect(response.data).toEqual("<html><body>Get categories</body></html>");
            });
    });

    it("route should work with parameter", () => {
        expect.assertions(3);
        return axios.get("/users/umed")
            .then((response: AxiosResponse) => {
                expect(response.status).toEqual(HttpStatusCodes.OK);
                expect(response.headers["content-type"]).toEqual("text/html; charset=utf-8");
                expect(response.data).toEqual("<html><body>One user</body></html>");
            });
    });

    it("route should work with regexp parameter", () => {
        return axios.get("/categories/1")
            .then((response: AxiosResponse) => {
                expect(response.status).toEqual(HttpStatusCodes.OK);
                expect(response.headers["content-type"]).toEqual("text/html; charset=utf-8");
                expect(response.data).toEqual("<html><body>One category</body></html>");
            });
    });

    it("should respond with 404 when regexp does not match", () => {
        expect.assertions(1);
        return axios.get("/categories/umed")
            .catch((error: AxiosError) => {
                expect(error.response.status).toEqual(HttpStatusCodes.NOT_FOUND);
            });
    });

    it("route should work with string regexp parameter", () => {
        expect.assertions(3);
        return axios.get("/posts/1")
            .then((response: AxiosResponse) => {
                expect(response.status).toEqual(HttpStatusCodes.OK);
                expect(response.headers["content-type"]).toEqual("text/html; charset=utf-8");
                expect(response.data).toEqual("<html><body>One post</body></html>");
            });
    });

    it("should respond with 404 when regexp does not match", () => {
        expect.assertions(1);
        return axios.get("/posts/U")
            .catch((error: AxiosError) => {
                expect(error.response.status).toEqual(HttpStatusCodes.NOT_FOUND);
            });
    });

    it("should return result from a promise", () => {
        expect.assertions(3);
        return axios.get("/posts-from-db")
            .then((response: AxiosResponse) => {
                expect(response.status).toEqual(HttpStatusCodes.OK);
                expect(response.headers["content-type"]).toEqual("text/html; charset=utf-8");
                expect(response.data).toEqual("<html><body>resolved after half second</body></html>");
            });
    });

    it("should respond with 500 if promise failed", () => {
        expect.assertions(3);
        return axios.get("/posts-from-failed-db")
            .catch((error: AxiosError) => {
                expect(error.response.status).toEqual(HttpStatusCodes.INTERNAL_SERVER_ERROR);
                expect(error.response.headers["content-type"]).toEqual("text/html; charset=utf-8");
                expect(error.response.data).toEqual("<html><body>cannot connect to a database</body></html>");
            });
    });

    it("should respond with 204 No Content when null returned in action", () => {
        expect.assertions(6);
        return Promise.all<AxiosResponse | void>([
            axios.get("/return/normal/null")
                .then((response: AxiosResponse) => {
                    expect(response.status).toEqual(HttpStatusCodes.NO_CONTENT);
                    expect(response.headers["content-type"]).toBeUndefined();
                    expect(response.data).toEqual("");
                }),
            axios.get("/return/json/null")
                .then((response: AxiosResponse) => {
                    expect(response.status).toEqual(HttpStatusCodes.NO_CONTENT);
                    expect(response.headers["content-type"]).toBeUndefined();
                    expect(response.data).toEqual("");
                })
        ]);
    });

    it("should respond with 404 Not Found text when undefined returned in action", () => {
        expect.assertions(2);
        return axios.get("/return/normal/undefined")
            .catch((error: AxiosError) => {
                expect(error.response.status).toEqual(HttpStatusCodes.NOT_FOUND);
                expect(error.response.headers["content-type"]).toEqual("text/html; charset=utf-8");
            });
    });

    it("should respond with 404 Not Found JSON when undefined returned in action", () => {
        expect.assertions(2);
        return axios.get("/return/json/undefined")
            .catch((error: AxiosError) => {
                expect(error.response.status).toEqual(HttpStatusCodes.NOT_FOUND);
                expect(error.response.headers["content-type"]).toEqual("application/json; charset=utf-8");
            });
    });

    it("should respond with 200 and text/html even in json controller's method", () => {
        expect.assertions(3);
        return axios.get("/json-controller/text-html")
            .then((response: AxiosResponse) => {
                expect(response.status).toEqual(HttpStatusCodes.OK);
                expect(response.headers["content-type"]).toEqual("text/html; charset=utf-8");
                expect(response.data).toEqual("<html>Test</html>");
            });
    });

    it("should respond with 200 and text/plain even in json controller's method", () => {
        expect.assertions(3);
        return axios.get("/json-controller/text-plain")
            .then((response: AxiosResponse) => {
                expect(response.status).toEqual(HttpStatusCodes.OK);
                expect(response.headers["content-type"]).toEqual("text/plain; charset=utf-8");
                expect(response.data).toEqual("Test");
            });
    });

    it("should respond with 401 and text/html when UnauthorizedError throwed even in json controller's method", () => {
        expect.assertions(4);
        return axios.get("/json-controller/text-plain-error")
            .catch((error: AxiosError) => {
                expect(error.response.status).toEqual(HttpStatusCodes.UNAUTHORIZED);
                expect(error.response.headers["content-type"]).toEqual("text/plain; charset=utf-8");
                expect(typeof error.response.data).toEqual("string");
                expect(error.response.data).toMatch(/UnauthorizedError.HttpError/);
            });
    });

    it("should respond with 401 and aplication/json when UnauthorizedError is thrown in standard json controller's method", () => {
        expect.assertions(4);
        return axios.get("/json-controller/json-error")
            .catch((error: AxiosError) => {
                expect(error.response.status).toEqual(HttpStatusCodes.UNAUTHORIZED);
                expect(error.response.headers["content-type"]).toEqual("application/json; charset=utf-8");
                expect(typeof error.response.data).toEqual("object");
                expect(error.response.data.name).toEqual("UnauthorizedError");
            });
    });
});
