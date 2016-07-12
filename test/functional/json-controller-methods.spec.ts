import "reflect-metadata";
import {JsonController} from "../../src/decorator/controllers";
import {Get, Post, Put, Patch, Delete, Head, Method} from "../../src/decorator/methods";
import {createServer, defaultMetadataArgsStorage} from "../../src/index";
const chakram = require("chakram");
const expect = chakram.expect;

describe("JsonController Methods", () => {
    describe("check @Get, @Post, @Put, @Patch, @Delete, @Head, custom response type, parameters in routes", () => {

        before(() => {
    
            // reset metadata args storage
            defaultMetadataArgsStorage().reset();
    
            @JsonController()
            class JsonUserController {
                @Get("/users")
                getAll() {
                    return [{
                        id: 1,
                        name: "Umed"
                    }, {
                        id: 2,
                        name: "Bakha"
                    }];
                }
                @Post("/users")
                post() {
                    return {
                        status: "saved"
                    };
                }
                @Put("/users")
                put() {
                    return {
                        status: "updated"
                    };
                }
                @Patch("/users")
                patch() {
                    return {
                        status: "patched"
                    };
                }
                @Delete("/users")
                delete() {
                    return {
                        status: "removed"
                    };
                }
                @Head("/users")
                head() {
                    return {
                        thisWillNot: "beSent"
                    };
                }
                @Method("post", "/categories")
                postCategories() {
                    return {
                        status: "posted"
                    };
                }
                @Method("delete", "/categories")
                getCategories() {
                    return {
                        status: "removed"
                    };
                }
                @Get("/categories-text", { responseType: "text" })
                getWithTextResponseType() {
                    return "All categories";
                }
                @Get("/categories-json", { responseType: "json" })
                getWithTextResponseJson() {
                    return {
                        id: 1,
                        name: "People"
                    };
                }
                @Get("/users/:id")
                getUserById() {
                    return {
                        id: 1,
                        name: "Umed"
                    };
                }
                @Get(/\/categories\/[\d+]/)
                getCategoryById() {
                    return {
                        id: 1,
                        name: "People"
                    };
                }
                @Get("/posts/:id(\\d+)")
                getPostById() {
                    return {
                        id: 1,
                        title: "About People"
                    };
                }
                @Get("/posts-from-db")
                getPostFromDb() {
                    return new Promise((ok, fail) => {
                        setTimeout(() => {
                            ok({
                                id: 1,
                                title: "Hello database post"
                            });
                        }, 500);
                    });
                }
                @Get("/posts-from-failed-db")
                getPostFromFailedDb() {
                    return new Promise((ok, fail) => {
                        setTimeout(() => {
                            fail({
                                code: 10954,
                                message: "Cannot connect to db"
                            });
                        }, 500);
                    });
                }
            }
        });
        
        let app: any;
        before(done => app = createServer().listen(3001, done));
        after(done => app.close(done));

        it("get should respond with proper status code, headers and body content", () => {
            return chakram
                .get("http://127.0.0.1:3001/users")
                .then((response: any) => {
                    expect(response).to.have.status(200);
                    expect(response).to.have.header("content-type", "application/json; charset=utf-8");
                    expect(response.body).to.be.instanceOf(Array);
                    expect(response.body).to.be.eql([{
                        id: 1,
                        name: "Umed"
                    }, {
                        id: 2,
                        name: "Bakha"
                    }]);
                });
        });
        
        it("post respond with proper status code, headers and body content", () => {
            return chakram
                .post("http://127.0.0.1:3001/users")
                .then((response: any) => {
                    expect(response).to.have.status(200);
                    expect(response).to.have.header("content-type", "application/json; charset=utf-8");
                    expect(response.body).to.be.eql({
                        status: "saved"
                    });
                });
        });
        
        it("put respond with proper status code, headers and body content", () => {
            return chakram
                .put("http://127.0.0.1:3001/users")
                .then((response: any) => {
                    expect(response).to.have.status(200);
                    expect(response).to.have.header("content-type", "application/json; charset=utf-8");
                    expect(response.body).to.be.eql({
                        status: "updated"
                    });
                });
        });
        
        it("patch respond with proper status code, headers and body content", () => {
            return chakram
                .patch("http://127.0.0.1:3001/users")
                .then((response: any) => {
                    expect(response).to.have.status(200);
                    expect(response).to.have.header("content-type", "application/json; charset=utf-8");
                    expect(response.body).to.be.eql({
                        status: "patched"
                    });
                });
        });
        
        it("delete respond with proper status code, headers and body content", () => {
            return chakram
                .delete("http://127.0.0.1:3001/users")
                .then((response: any) => {
                    expect(response).to.have.status(200);
                    expect(response).to.have.header("content-type", "application/json; charset=utf-8");
                    expect(response.body).to.be.eql({
                        status: "removed"
                    });
                });
        });

        it("head respond with proper status code, headers and body content", () => {
            return chakram
                .head("http://127.0.0.1:3001/users")
                .then((response: any) => {
                    expect(response).to.have.status(200);
                    expect(response).to.have.header("content-type", "application/json; charset=utf-8");
                    expect(response.body).to.be.undefined;
                });
        });

        it("custom method (post) respond with proper status code, headers and body content", () => {
            return chakram
                .post("http://127.0.0.1:3001/categories")
                .then((response: any) => {
                    expect(response).to.have.status(200);
                    expect(response).to.have.header("content-type", "application/json; charset=utf-8");
                    expect(response.body).to.be.eql({
                        status: "posted"
                    });
                });
        });

        it("custom method (delete) respond with proper status code, headers and body content", () => {
            return chakram
                .delete("http://127.0.0.1:3001/categories")
                .then((response: any) => {
                    expect(response).to.have.status(200);
                    expect(response).to.have.header("content-type", "application/json; charset=utf-8");
                    expect(response.body).to.be.eql({
                        status: "removed"
                    });
                });
        });

        it("custom response type (text)", () => {
            return chakram
                .get("http://127.0.0.1:3001/categories-text")
                .then((response: any) => {
                    expect(response).to.have.status(200);
                    expect(response).to.have.header("content-type", "text/html; charset=utf-8");
                    expect(response.body).to.be.equal("All categories");
                });
        });

        it("custom response type (json)", () => {
            return chakram
                .get("http://127.0.0.1:3001/categories-json")
                .then((response: any) => {
                    expect(response).to.have.status(200);
                    expect(response).to.have.header("content-type", "application/json; charset=utf-8");
                    expect(response.body.id).to.be.equal(1);
                    expect(response.body.name).to.be.equal("People");
                });
        });

        it("route should work with parameter", () => {
            return chakram
                .get("http://127.0.0.1:3001/users/umed")
                .then((response: any) => {
                    expect(response).to.have.status(200);
                    expect(response).to.have.header("content-type", "application/json; charset=utf-8");
                    expect(response.body).to.be.eql({
                        id: 1,
                        name: "Umed"
                    });
                });
        });

        it("route should work with regexp parameter", () => {
            return chakram
                .get("http://127.0.0.1:3001/categories/1")
                .then((response: any) => {
                    expect(response).to.have.status(200);
                    expect(response).to.have.header("content-type", "application/json; charset=utf-8");
                    expect(response.body).to.be.eql({
                        id: 1,
                        name: "People"
                    });
                });
        });

        it("should respond with 404 when regexp does not match", () => {
            return chakram
                .get("http://127.0.0.1:3001/categories/umed")
                .then((response: any) => {
                    expect(response).to.have.status(404);
                });
        });

        it("route should work with string regexp parameter", () => {
            return chakram
                .get("http://127.0.0.1:3001/posts/1")
                .then((response: any) => {
                    expect(response).to.have.status(200);
                    expect(response).to.have.header("content-type", "application/json; charset=utf-8");
                    expect(response.body).to.be.eql({
                        id: 1,
                        title: "About People"
                    });
                });
        });

        it("should respond with 404 when regexp does not match", () => {
            return chakram
                .get("http://127.0.0.1:3001/posts/U")
                .then((response: any) => {
                    expect(response).to.have.status(404);
                });
        });

        it("should return result from a promise", () => {
            return chakram
                .get("http://127.0.0.1:3001/posts-from-db")
                .then((response: any) => {
                    expect(response).to.have.status(200);
                    expect(response).to.have.header("content-type", "application/json; charset=utf-8");
                    expect(response.body).to.be.eql({
                        id: 1,
                        title: "Hello database post"
                    });
                });
        });

        it("should respond with 500 if promise failed", () => {
            return chakram
                .get("http://127.0.0.1:3001/posts-from-failed-db")
                .then((response: any) => {
                    expect(response).to.have.status(500);
                    expect(response).to.have.header("content-type", "application/json; charset=utf-8");
                    expect(response.body).to.be.eql({
                        code: 10954,
                        message: "Cannot connect to db"
                    });
                });
        });

    });
});