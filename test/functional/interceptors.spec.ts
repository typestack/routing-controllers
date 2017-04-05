import "reflect-metadata";
import {Controller} from "../../src/decorator/JsonController";
import {Get} from "../../src/decorator/Method";
import {createExpressServer, defaultMetadataArgsStorage, createKoaServer} from "../../src/index";
import {assertRequest} from "./test-utils";
import {UseInterceptor, Interceptor, InterceptorGlobal} from "../../src/decorator/JsonResponse";
import {InterceptorInterface} from "../../src/middleware/InterceptorInterface";
const chakram = require("chakram");
const expect = chakram.expect;

describe("interceptor", () => {

    before(() => {

        // reset metadata args storage
        defaultMetadataArgsStorage().reset();

        @InterceptorGlobal()
        class NumbersInterceptor implements InterceptorInterface {
            intercept(request: any, response: any, result: any): any {
                return result.replace(/[0-9]/gi, "");
            }
        }

        @Interceptor()
        class ByeWordInterceptor implements InterceptorInterface {
            intercept(request: any, response: any, result: any): any {
                return result.replace(/bye/gi, "hello");
            }
        }

        @Interceptor()
        class BadWordsInterceptor implements InterceptorInterface {
            intercept(request: any, response: any, result: any): any {
                return result.replace(/damn/gi, "***");
            }
        }

        @Interceptor()
        class AsyncInterceptor implements InterceptorInterface {
            intercept(request: any, response: any, result: any): any {
                return new Promise(ok => {
                    setTimeout(() => {
                        ok(result.replace(/hello/gi, "bye"));
                    }, 1000);
                });
            }
        }

        @Controller()
        @UseInterceptor(ByeWordInterceptor)
        class HandledController {

            @Get("/users")
            @UseInterceptor((request: any, response: any, result: any) => {
                return result.replace(/hello/gi, "hello world");
            })
            getUsers(): any {
                return "<html><body>damn hello</body></html>";
            }

            @Get("/posts")
            @UseInterceptor(BadWordsInterceptor)
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
            @UseInterceptor(AsyncInterceptor)
            photos(): any {
                return "<html><body>hello world</body></html>";
            }

        }

    });

    let expressApp: any, koaApp: any;
    before(done => expressApp = createExpressServer().listen(3001, done));
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