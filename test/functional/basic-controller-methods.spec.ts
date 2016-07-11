import "reflect-metadata";
import {Controller} from "../../src/decorator/controllers";
import {Get, Post, Put, Patch, Delete, Head, Method} from "../../src/decorator/methods";
import {createServer, defaultMetadataArgsStorage} from "../../src/index";
const chakram = require("chakram");
const expect = chakram.expect;

describe("Controller > basic functionality", () => {
    describe("check @Get, @Post, @Put, @Patch, @Delete, @Head, custom response type, parameters in routes, promises", () => {

        before(() => {
    
            // reset metadata args storage
            defaultMetadataArgsStorage().reset();
    
            @Controller()
            class UserController {
                @Get("/users")
                getAll() {
                    return "All users";
                }
                @Post("/users")
                post() {
                    return "Posting user";
                }
                @Put("/users")
                put() {
                    return "Putting user";
                }
                @Patch("/users")
                patch() {
                    return "Patching user";
                }
                @Delete("/users")
                delete() {
                    return "Removing user";
                }
                @Head("/users")
                head() {
                    return "Removing user";
                }
                @Method("post", "/categories")
                postCategories() {
                    return "Posting categories";
                }
                @Method("delete", "/categories")
                getCategories() {
                    return "Get categories";
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
                    return "One user";
                }
                @Get(/\/categories\/[\d+]/)
                getCategoryById() {
                    return "One category";
                }
                @Get("/posts/:id(\\d+)")
                getPostById() {
                    return "One post";
                }
                @Get("/posts-from-db")
                getPostFromDb() {
                    return new Promise((ok, fail) => {
                        setTimeout(() => {
                            ok("resolved after half second");
                        }, 500);
                    });
                }
                @Get("/posts-from-failed-db")
                getPostFromFailedDb() {
                    return new Promise((ok, fail) => {
                        setTimeout(() => {
                            fail("cannot connect to a database");
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
                    expect(response).to.have.header("content-type", "text/html; charset=utf-8");
                    expect(response.body).to.be.equal("All users");
                });
        });
        
        it("post respond with proper status code, headers and body content", () => {
            return chakram
                .post("http://127.0.0.1:3001/users")
                .then((response: any) => {
                    expect(response).to.have.status(200);
                    expect(response).to.have.header("content-type", "text/html; charset=utf-8");
                    expect(response.body).to.be.equal("Posting user");
                });
        });
        
        it("put respond with proper status code, headers and body content", () => {
            return chakram
                .put("http://127.0.0.1:3001/users")
                .then((response: any) => {
                    expect(response).to.have.status(200);
                    expect(response).to.have.header("content-type", "text/html; charset=utf-8");
                    expect(response.body).to.be.equal("Putting user");
                });
        });
        
        it("patch respond with proper status code, headers and body content", () => {
            return chakram
                .patch("http://127.0.0.1:3001/users")
                .then((response: any) => {
                    expect(response).to.have.status(200);
                    expect(response).to.have.header("content-type", "text/html; charset=utf-8");
                    expect(response.body).to.be.equal("Patching user");
                });
        });
        
        it("delete respond with proper status code, headers and body content", () => {
            return chakram
                .delete("http://127.0.0.1:3001/users")
                .then((response: any) => {
                    expect(response).to.have.status(200);
                    expect(response).to.have.header("content-type", "text/html; charset=utf-8");
                    expect(response.body).to.be.equal("Removing user");
                });
        });

        it("head respond with proper status code, headers and body content", () => {
            return chakram
                .head("http://127.0.0.1:3001/users")
                .then((response: any) => {
                    expect(response).to.have.status(200);
                    expect(response).to.have.header("content-type", "text/html; charset=utf-8");
                    expect(response.body).to.be.undefined;
                });
        });

        it("custom method (post) respond with proper status code, headers and body content", () => {
            return chakram
                .post("http://127.0.0.1:3001/categories")
                .then((response: any) => {
                    expect(response).to.have.status(200);
                    expect(response).to.have.header("content-type", "text/html; charset=utf-8");
                    expect(response.body).to.be.equal("Posting categories");
                });
        });

        it("custom method (delete) respond with proper status code, headers and body content", () => {
            return chakram
                .delete("http://127.0.0.1:3001/categories")
                .then((response: any) => {
                    expect(response).to.have.status(200);
                    expect(response).to.have.header("content-type", "text/html; charset=utf-8");
                    expect(response.body).to.be.equal("Get categories");
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
                    expect(response).to.have.header("content-type", "text/html; charset=utf-8");
                    expect(response.body).to.be.equal("One user");
                });
        });

        it("route should work with regexp parameter", () => {
            return chakram
                .get("http://127.0.0.1:3001/categories/1")
                .then((response: any) => {
                    expect(response).to.have.status(200);
                    expect(response).to.have.header("content-type", "text/html; charset=utf-8");
                    expect(response.body).to.be.equal("One category");
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
                    expect(response).to.have.header("content-type", "text/html; charset=utf-8");
                    expect(response.body).to.be.equal("One post");
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
                    expect(response).to.have.header("content-type", "text/html; charset=utf-8");
                    expect(response.body).to.be.equal("resolved after half second");
                });
        });

        it("should respond with 500 if promise failed", () => {
            return chakram
                .get("http://127.0.0.1:3001/posts-from-failed-db")
                .then((response: any) => {
                    expect(response).to.have.status(500);
                    expect(response).to.have.header("content-type", "text/html; charset=utf-8");
                    expect(response.body).to.be.equal("cannot connect to a database");
                });
        });

    });
});