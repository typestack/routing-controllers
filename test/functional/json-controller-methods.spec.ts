import "reflect-metadata";
import {JsonController} from "../../src/deprecated/JsonController";
import {Get, Post, Put, Patch, Delete, Head, Method} from "../../src/decorator/Method";
import {createExpressServer, defaultMetadataArgsStorage, createKoaServer} from "../../src/index";
import {assertRequest} from "./test-utils";
import {TextResponse, JsonResponse} from "../../src/deprecated/JsonResponse";
const chakram = require("chakram");
const expect = chakram.expect;

describe("json-controller methods", () => {

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

    let expressApp: any, koaApp: any;
    before(done => expressApp = createExpressServer().listen(3001, done));
    after(done => expressApp.close(done));
    before(done => koaApp = createKoaServer().listen(3002, done));
    after(done => koaApp.close(done));

    describe("get should respond with proper status code, headers and body content", () => {
        assertRequest([3001, 3002], "get", "users", response => {
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
    
    describe("post respond with proper status code, headers and body content", () => {
        assertRequest([3001, 3002], "post", "users", response => {
            expect(response).to.have.status(200);
            expect(response).to.have.header("content-type", "application/json; charset=utf-8");
            expect(response.body).to.be.eql({
                status: "saved"
            });
        });
    });
    
    describe("put respond with proper status code, headers and body content", () => {
        assertRequest([3001, 3002], "put", "users", response => {
            expect(response).to.have.status(200);
            expect(response).to.have.header("content-type", "application/json; charset=utf-8");
            expect(response.body).to.be.eql({
                status: "updated"
            });
        });
    });
    
    describe("patch respond with proper status code, headers and body content", () => {
        assertRequest([3001, 3002], "patch", "users", response => {
            expect(response).to.have.status(200);
            expect(response).to.have.header("content-type", "application/json; charset=utf-8");
            expect(response.body).to.be.eql({
                status: "patched"
            });
        });
    });
    
    describe("delete respond with proper status code, headers and body content", () => {
        assertRequest([3001, 3002], "delete", "users", response => {
            expect(response).to.have.status(200);
            expect(response).to.have.header("content-type", "application/json; charset=utf-8");
            expect(response.body).to.be.eql({
                status: "removed"
            });
        });
    });

    describe("head respond with proper status code, headers and body content", () => {
        assertRequest([3001, 3002], "head", "users", response => {
            expect(response).to.have.status(200);
            expect(response).to.have.header("content-type", "application/json; charset=utf-8");
            expect(response.body).to.be.undefined;
        });
    });

    describe("custom method (post) respond with proper status code, headers and body content", () => {
        assertRequest([3001, 3002], "post", "categories", response => {
            expect(response).to.have.status(200);
            expect(response).to.have.header("content-type", "application/json; charset=utf-8");
            expect(response.body).to.be.eql({
                status: "posted"
            });
        });
    });

    describe("custom method (delete) respond with proper status code, headers and body content", () => {
        assertRequest([3001, 3002], "delete", "categories", response => {
            expect(response).to.have.status(200);
            expect(response).to.have.header("content-type", "application/json; charset=utf-8");
            expect(response.body).to.be.eql({
                status: "removed"
            });
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
            expect(response).to.have.header("content-type", "application/json; charset=utf-8");
            expect(response.body).to.be.eql({
                id: 1,
                name: "Umed"
            });
        });
    });

    describe("route should work with regexp parameter", () => {
        assertRequest([3001, 3002], "get", "categories/1", response => {
            expect(response).to.have.status(200);
            expect(response).to.have.header("content-type", "application/json; charset=utf-8");
            expect(response.body).to.be.eql({
                id: 1,
                name: "People"
            });
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
            expect(response).to.have.header("content-type", "application/json; charset=utf-8");
            expect(response.body).to.be.eql({
                id: 1,
                title: "About People"
            });
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
            expect(response).to.have.header("content-type", "application/json; charset=utf-8");
            expect(response.body).to.be.eql({
                id: 1,
                title: "Hello database post"
            });
        });
    });

    describe("should respond with 500 if promise failed", () => {
        assertRequest([3001, 3002], "get", "posts-from-failed-db", response => {
            expect(response).to.have.status(500);
            expect(response).to.have.header("content-type", "application/json; charset=utf-8");
            expect(response.body).to.be.eql({
                code: 10954,
                message: "Cannot connect to db"
            });
        });
    });

});