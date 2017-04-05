import "reflect-metadata";
import {Controller} from "../../src/deprecated/JsonController";
import {Get, Post, Put, Patch, Delete, Head, Method} from "../../src/decorator/Method";
import {createExpressServer, defaultMetadataArgsStorage, createKoaServer} from "../../src/index";
import {assertRequest} from "./test-utils";
import {TextResponse, JsonResponse} from "../../src/deprecated/JsonResponse";
const chakram = require("chakram");
const expect = chakram.expect;

describe("controller methods", () => {

    before(() => {

        // reset metadata args storage
        defaultMetadataArgsStorage().reset();

        @Controller()
        class UserController {
            @Get("/users")
            getAll() {
                return "<html><body>All users</body></html>";
            }
            @Post("/users")
            post() {
                return "<html><body>Posting user</body></html>";
            }
            @Put("/users")
            put() {
                return "<html><body>Putting user</body></html>";
            }
            @Patch("/users")
            patch() {
                return "<html><body>Patching user</body></html>";
            }
            @Delete("/users")
            delete() {
                return "<html><body>Removing user</body></html>";
            }
            @Head("/users")
            head() {
                return "<html><body>Removing user</body></html>";
            }
            @Method("post", "/categories")
            postCategories() {
                return "<html><body>Posting categories</body></html>";
            }
            @Method("delete", "/categories")
            getCategories() {
                return "<html><body>Get categories</body></html>";
            }
            @Get("/categories-text")
            @TextResponse()
            getWithTextResponseType() {
                return "<html><body>All categories</body></html>";
            }
            @Get("/categories-json")
            @JsonResponse()
            getWithTextResponseJson() {
                return {
                    id: 1,
                    name: "People"
                };
            }
            @Get("/users/:id")
            getUserById() {
                return "<html><body>One user</body></html>";
            }
            @Get(/\/categories\/[\d+]/)
            getCategoryById() {
                return "<html><body>One category</body></html>";
            }
            @Get("/posts/:id(\\d+)")
            getPostById() {
                return "<html><body>One post</body></html>";
            }
            @Get("/posts-from-db")
            getPostFromDb() {
                return new Promise((ok, fail) => {
                    setTimeout(() => {
                        ok("<html><body>resolved after half second</body></html>");
                    }, 500);
                });
            }
            @Get("/posts-from-failed-db")
            getPostFromFailedDb() {
                return new Promise((ok, fail) => {
                    setTimeout(() => {
                        fail("<html><body>cannot connect to a database</body></html>");
                    }, 500);
                });
            }
        }

    });

    let expressApp: any, koaApp: any;
    before(done => expressApp = createExpressServer().listen(3001, done));
    after(done => expressApp.close(done));
    before(done => koaApp = createKoaServer().listen(3002, done));
    after(done => koaApp.close(done));

    describe("get should respond with proper status code, headers and body content", () => {
        assertRequest([3001, 3002], "get", "users", response => {
            expect(response).to.have.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            expect(response.body).to.be.equal("<html><body>All users</body></html>");
        });
    });

    describe("post respond with proper status code, headers and body content", () => {
        assertRequest([3001, 3002], "post", "users", response => {
            expect(response).to.have.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            expect(response.body).to.be.equal("<html><body>Posting user</body></html>");
        });
    });
    
    describe("put respond with proper status code, headers and body content", () => {
        assertRequest([3001, 3002], "put", "users", response => {
            expect(response).to.have.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            expect(response.body).to.be.equal("<html><body>Putting user</body></html>");
        });
    });
    
    describe("patch respond with proper status code, headers and body content", () => {
        assertRequest([3001, 3002], "patch", "users", response => {
            expect(response).to.have.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            expect(response.body).to.be.equal("<html><body>Patching user</body></html>");
        });
    });
    
    describe("delete respond with proper status code, headers and body content", () => {
        assertRequest([3001, 3002], "delete", "users", response => {
            expect(response).to.have.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            expect(response.body).to.be.equal("<html><body>Removing user</body></html>");
        });
    });

    describe("head respond with proper status code, headers and body content", () => {
        assertRequest([3001, 3002], "head", "users", response => {
            expect(response).to.have.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            expect(response.body).to.be.undefined;
        });
    });

    describe("custom method (post) respond with proper status code, headers and body content", () => {
        assertRequest([3001, 3002], "post", "categories", response => {
            expect(response).to.have.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            expect(response.body).to.be.equal("<html><body>Posting categories</body></html>");
        });
    });

    describe("custom method (delete) respond with proper status code, headers and body content", () => {
        assertRequest([3001, 3002], "delete", "categories", response => {
            expect(response).to.have.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            expect(response.body).to.be.equal("<html><body>Get categories</body></html>");
        });
    });

    describe("custom response type (text)", () => {
        assertRequest([3001, 3002], "get", "categories-text", response => {
            expect(response).to.have.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            expect(response.body).to.be.equal("<html><body>All categories</body></html>");
        });
    });

    describe("custom response type (json)", () => {
        assertRequest([3001, 3002], "get", "categories-json", response => {
            expect(response).to.have.status(200);
            expect(response).to.have.header("content-type", "application/json; charset=utf-8");
            expect(response.body.id).to.be.equal(1);
            expect(response.body.name).to.be.equal("People");
        });
    });

    describe("route should work with parameter", () => {
        assertRequest([3001, 3002], "get", "users/umed", response => {
            expect(response).to.have.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            expect(response.body).to.be.equal("<html><body>One user</body></html>");
        });
    });

    describe("route should work with regexp parameter", () => {
        assertRequest([3001, 3002], "get", "categories/1", response => {
            expect(response).to.have.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            expect(response.body).to.be.equal("<html><body>One category</body></html>");
        });
    });

    describe("should respond with 404 when regexp does not match", () => {
        assertRequest([3001, 3002], "get", "categories/umed", response => {
            expect(response).to.have.status(404);
        });
    });

    describe("route should work with string regexp parameter", () => {
        assertRequest([3001, 3002], "get", "posts/1", response => {
            expect(response).to.have.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            expect(response.body).to.be.equal("<html><body>One post</body></html>");
        });
    });

    describe("should respond with 404 when regexp does not match", () => {
        assertRequest([3001, 3002], "get", "posts/U", response => {
            expect(response).to.have.status(404);
        });
    });

    describe("should return result from a promise", () => {
        assertRequest([3001, 3002], "get", "posts-from-db", response => {
            expect(response).to.have.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            expect(response.body).to.be.equal("<html><body>resolved after half second</body></html>");
        });
    });

    describe("should respond with 500 if promise failed", () => {
        assertRequest([3001, 3002], "get", "posts-from-failed-db", response => {
            expect(response).to.have.status(500);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            expect(response.body).to.be.equal("<html><body>cannot connect to a database</body></html>");
        });
    });

});