import "reflect-metadata";
import {Controller} from "../../src/decorator/controllers";
import {Get} from "../../src/decorator/methods";
import {createServer, defaultMetadataArgsStorage} from "../../src/index";
import {UseBefore, UseAfter, Middleware, GlobalMiddleware} from "../../src/decorator/decorators";
import {MiddlewareInterface} from "../../src/middleware/MiddlewareInterface";
const chakram = require("chakram");
const expect = chakram.expect;

describe("middlewares", () => {

    let useBefore: boolean,
        useAfter: boolean,
        useCustom: boolean,
        useGlobalBefore: boolean,
        useGlobalAfter: boolean,
        useCallOrder: string,
        useGlobalCallOrder: string;

    beforeEach(() => {
        useBefore = false;
        useAfter = undefined;
        useCustom = undefined;
        useGlobalBefore = undefined;
        useGlobalAfter = undefined;
        useCallOrder = undefined;
    });
    
    before(() => {

        // reset metadata args storage
        defaultMetadataArgsStorage().reset();

        @GlobalMiddleware()
        class TestGlobalBeforeMidleware implements MiddlewareInterface {

            use(request: any, response: any, next: Function): void {
                useGlobalBefore = true;
                useGlobalCallOrder = "setFromGlobalBefore";
                next();
            }

        }

        @GlobalMiddleware({ afterAction: true })
        class TestGlobalAfterMidleware implements MiddlewareInterface {

            use(request: any, response: any, next: Function): void {
                useGlobalAfter = true;
                useGlobalCallOrder = "setFromGlobalAfter";
                next();
            }

        }

        @Middleware()
        class TestLoggerMiddleware implements MiddlewareInterface {

            use(request: any, response: any, next: Function): void {
                useCustom = true;
                next();
            }

        }

        @Controller()
        class UseController {

            @Get("/blogs")
            blogs() {
                useGlobalCallOrder = "setFromController";
                return "1234";
            }

            @Get("/users")
            @UseBefore(function (request: any, response: any, next: Function) {
                useBefore = true;
                useCallOrder = "setFromUseBefore";
                next();
            })
            users() {
                useCallOrder = "setFromController";
                return "1234";
            }

            @Get("/photos")
            @UseAfter(function (request: any, response: any, next: Function) {
                useAfter = true;
                useCallOrder = "setFromUseAfter";
                next();
            })
            photos() {
                useCallOrder = "setFromController";
                return "1234";
            }

            @Get("/posts")
            @UseBefore(function (request: any, response: any, next: Function) {
                useBefore = true;
                useCallOrder = "setFromUseBefore";
                next();
            })
            @UseAfter(function (request: any, response: any, next: Function) {
                useAfter = true;
                useCallOrder = "setFromUseAfter";
                next();
            })
            posts() {
                useCallOrder = "setFromController";
                return "1234";
            }
            
        }
    });

    let app: any;
    before(done => app = createServer().listen(3001, done));
    after(done => app.close(done));

    it("should call a global middlewares", () => {
        return chakram
            .get("http://127.0.0.1:3001/blogs")
            .then((response: any) => {
                expect(useGlobalBefore).to.be.equal(true);
                expect(useGlobalAfter).to.be.equal(true);
                expect(useGlobalCallOrder).to.be.equal("setFromGlobalAfter");
                expect(response).to.have.status(200);
            });
    });

    it("should call middleware and call it before controller action when @UseBefore is used", () => {
        return chakram
            .get("http://127.0.0.1:3001/users")
            .then((response: any) => {
                expect(useBefore).to.be.equal(true);
                expect(useCallOrder).to.be.equal("setFromController");
                expect(response).to.have.status(200);
            });
    });

    it("should call middleware and call it after controller action when @UseAfter is used", () => {
        return chakram
            .get("http://127.0.0.1:3001/photos")
            .then((response: any) => {
                expect(useAfter).to.be.equal(true);
                expect(useCallOrder).to.be.equal("setFromUseAfter");
                expect(response).to.have.status(200);
            });
    });

    it("should call before middleware and call after middleware when @UseAfter and @UseAfter are used", () => {
        return chakram
            .get("http://127.0.0.1:3001/posts")
            .then((response: any) => {
                expect(useBefore).to.be.equal(true);
                expect(useAfter).to.be.equal(true);
                expect(useCallOrder).to.be.equal("setFromUseAfter");
                expect(response).to.have.status(200);
            });
    });

});