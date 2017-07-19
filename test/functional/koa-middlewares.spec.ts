import "reflect-metadata";
import {Controller} from "../../src/decorator/Controller";
import {Get} from "../../src/decorator/Get";
import {UseBefore} from "../../src/decorator/UseBefore";
import {Middleware} from "../../src/decorator/Middleware";
import {UseAfter} from "../../src/decorator/UseAfter";
import {createKoaServer, getMetadataArgsStorage} from "../../src/index";
import {KoaMiddlewareInterface} from "../../src/driver/koa/KoaMiddlewareInterface";
import {NotAcceptableError} from "./../../src/http-error/NotAcceptableError";
const chakram = require("chakram");
const expect = chakram.expect;

describe("koa middlewares", () => {

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
        getMetadataArgsStorage().reset();

        @Middleware({ type: "before" })
        class TestGlobalBeforeKoaMidleware implements KoaMiddlewareInterface {

            use(context: any, next?: Function): any {
                useGlobalBefore = true;
                useGlobalCallOrder = "setFromGlobalBefore";
                return next();
            }

        }

        @Middleware({ type: "after" })
        class TestGlobalAfterKoaMidleware implements KoaMiddlewareInterface {

            use(context: any, next?: Function): any {
                useGlobalAfter = true;
                useGlobalCallOrder = "setFromGlobalAfter";
                return next();
            }

        }

        class TestLoggerKoaMiddleware implements KoaMiddlewareInterface {

            use(context: any, next?: Function): any {
                useCustom = true;
                return next();
            }

        }

        class TestCustomMiddlewareWhichThrows implements KoaMiddlewareInterface {

            use(request: any, response: any, next?: Function): any {
                throw new NotAcceptableError('TestCustomMiddlewareWhichThrows');
            }

        }

        @Controller()
        class KoaMiddlewareController {

            @Get("/blogs")
            blogs() {
                useGlobalCallOrder = "setFromController";
                return "1234";
            }

            @Get("/questions")
            @UseBefore(TestLoggerKoaMiddleware)
            questions() {
                return "1234";
            }

            @Get("/users")
            @UseBefore(function (context: any, next: Function) {
                useBefore = true;
                useCallOrder = "setFromUseBefore";
                return next();
            })
            users() {
                useCallOrder = "setFromController";
                return "1234";
            }

            @Get("/photos")
            @UseAfter(function (context: any, next: Function) {
                useAfter = true;
                useCallOrder = "setFromUseAfter";
                return next();
            })
            photos() {
                useCallOrder = "setFromController";
                return "1234";
            }

            @Get("/posts")
            @UseBefore(function (context: any, next: Function) {
                useBefore = true;
                useCallOrder = "setFromUseBefore";
                return next();
            })
            @UseAfter(function (context: any, next: Function) {
                useAfter = true;
                useCallOrder = "setFromUseAfter";
                return next();
            })
            posts() {
                useCallOrder = "setFromController";
                return "1234";
            }

            @Get("/customMiddlewareWichThrows")
            @UseBefore(TestCustomMiddlewareWhichThrows)
            customMiddlewareWichThrows() {
                return "1234";
            }

        }
    });

    let app: any;
    before(done => app = createKoaServer({ automaticFallthrough: true }).listen(3001, done));
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

    it("should use a custom middleware when @UseBefore or @UseAfter is used", () => {
        return chakram
            .get("http://127.0.0.1:3001/questions")
            .then((response: any) => {
                expect(useCustom).to.be.equal(true);
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

    it("should handle errors in custom middlewares", () => {
        return chakram
            .get("http://127.0.0.1:3001/customMiddlewareWichThrows")
            .then((response: any) => {
                expect(response).to.have.status(406);
            });
    });

});