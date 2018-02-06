import "reflect-metadata";
import {bootstrap, createKoaServer, getMetadataArgsStorage} from "../../src/index";
import {assertRequest} from "./test-utils";
import {InterceptorInterface} from "../../src/interface/InterceptorInterface";
import {Intercept} from "../../src/decorator/Intercept";
import {Controller} from "../../src/decorator/Controller";
import {Get} from "../../src/decorator/Get";
import {Action} from "../../src/Action";

const chakram = require("chakram");
const expect = chakram.expect;

describe("interceptor", () => {

    before(() => {

        // reset metadata args storage
        getMetadataArgsStorage().reset();

        class NumbersInterceptor implements InterceptorInterface {
            intercept(action: Action, result: any): any {
                return result.replace(/[0-9]/gi, "");
            }
        }

        class ByeWordInterceptor implements InterceptorInterface {
            intercept(action: Action, result: any): any {
                return result.replace(/bye/gi, "hello");
            }
        }

        class BadWordsInterceptor implements InterceptorInterface {
            intercept(action: Action, result: any): any {
                return result.replace(/damn/gi, "***");
            }
        }

        class AsyncInterceptor implements InterceptorInterface {
            intercept(action: Action, result: any): any {
                return new Promise(ok => {
                    setTimeout(() => {
                        ok(result.replace(/hello/gi, "bye"));
                    }, 1000);
                });
            }
        }

        @Controller()
        @Intercept(ByeWordInterceptor)
        class HandledController {

            @Get("/users")
            @Intercept((action: Action, result: any) => {
                return result.replace(/hello/gi, "hello world");
            })
            getUsers(): any {
                return "<html><body>damn hello</body></html>";
            }

            @Get("/posts")
            @Intercept(BadWordsInterceptor)
            posts(): any {
                return "<html><body>this post contains damn bad words</body></html>";
            }

            @Get("/questions")
            questions(): any {
                return "<html><body>bye world</body></html>";
            }

            @Get("/files")
            files(): any {
                return "<html><body>hello1234567890 world</body></html>";
            }

            @Get("/photos")
            @Intercept(AsyncInterceptor)
            photos(): any {
                return "<html><body>hello world</body></html>";
            }

        }

    });

    let expressApp: any, koaApp: any;
    before(done => expressApp = bootstrap().listen(3001, done));
    after(done => expressApp.close(done));
    before(done => koaApp = createKoaServer().listen(3002, done));
    after(done => koaApp.close(done));

    describe("custom interceptor function should replace returned content", () => {
        assertRequest([3001, 3002], "get", "users", response => {
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            expect(response.body).to.be.equal("<html><body>damn hello world</body></html>");
        });
    });

    describe("custom interceptor class should replace returned content", () => {
        assertRequest([3001, 3002], "get", "posts", response => {
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            expect(response.body).to.be.equal("<html><body>this post contains *** bad words</body></html>");
        });
    });

    describe("custom interceptor class used on the whole controller should replace returned content", () => {
        assertRequest([3001, 3002], "get", "questions", response => {
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            expect(response.body).to.be.equal("<html><body>hello world</body></html>");
        });
    });

    describe("global interceptor class should replace returned content", () => {
        assertRequest([3001, 3002], "get", "files", response => {
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            expect(response.body).to.be.equal("<html><body>hello world</body></html>");
        });
    });

    describe("interceptors should support promises", () => {
        assertRequest([3001, 3002], "get", "photos", response => {
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            expect(response.body).to.be.equal("<html><body>bye world</body></html>");
        });
    });

});