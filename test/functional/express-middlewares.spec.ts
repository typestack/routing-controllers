import "reflect-metadata";
import {bootstrap, getMetadataArgsStorage} from "../../src/index";
import {MiddlewareInterface} from "../../src/interface/MiddlewareInterface";
import {Controller} from "../../src/decorator/Controller";
import {Get} from "../../src/decorator/Get";
import {Use} from "../../src/decorator/Use";
import {NotAcceptableError} from "./../../src/http-error/NotAcceptableError";

const chakram = require("chakram");
const expect = chakram.expect;

describe("express middlewares", () => {

    let useBefore: boolean,
        useAfter: boolean,
        useCustom: boolean,
        useCustomWithError: boolean,
        useGlobalBeforeWithError: boolean,
        useGlobalBefore: boolean,
        useGlobalAfter: boolean,
        useCallOrder: string,
        useGlobalCallOrder: string;

    beforeEach(() => {
        useBefore = false;
        useAfter = undefined;
        useCustom = undefined;
        useCustomWithError = undefined;
        useGlobalBeforeWithError = undefined;
        useGlobalBefore = undefined;
        useGlobalAfter = undefined;
        useCallOrder = undefined;
    });

    before(() => {

        // reset metadata args storage
        getMetadataArgsStorage().reset();

        class TestGlobalBeforeMidleware implements MiddlewareInterface {

            use(request: any, response: any, next?: Function): any {
                useGlobalBefore = true;
                useGlobalCallOrder = "setFromGlobalBefore";
                next();
            }

        }

        class TestGlobalAfterMidleware implements MiddlewareInterface {

            use(request: any, response: any, next?: Function): any {
                useGlobalAfter = true;
                useGlobalCallOrder = "setFromGlobalAfter";
                next();
            }

        }

        class TestLoggerMiddleware implements MiddlewareInterface {

            use(request: any, response: any, next?: Function): any {
                useCustom = true;
                next();
            }

        }

        class TestCustomMiddlewareWhichThrows implements MiddlewareInterface {

            use(request: any, response: any, next?: Function): any {
                throw new NotAcceptableError("TestCustomMiddlewareWhichThrows");
            }

        }

        @Controller()
        class ExpressMiddlewareController {

            @Get("/blogs")
            blogs() {
                useGlobalCallOrder = "setFromController";
                return "1234";
            }

            @Get("/questions")
            @Use(TestLoggerMiddleware)
            questions() {
                return "1234";
            }

            @Get("/users")
            @Use(function (request: any, response: any, next: Function) {
                useBefore = true;
                useCallOrder = "setFromUseBefore";
                next();
            })
            users() {
                useCallOrder = "setFromController";
                return "1234";
            }

            @Get("/posts")
            @Use(function (request: any, response: any, next: Function) {
                useBefore = true;
                useCallOrder = "setFromUseBefore";
                next();
            })
            posts() {
                useCallOrder = "setFromController";
                return "1234";
            }

            @Get("/customMiddlewareWichThrows")
            @Use(TestCustomMiddlewareWhichThrows)
            customMiddlewareWichThrows() {
                return "1234";
            }
        }
    });

    let app: any;
    before(done => app = bootstrap().listen(3001, done));
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

    it("should handle errors in custom middlewares", () => {
        return chakram
            .get("http://127.0.0.1:3001/customMiddlewareWichThrows")
            .then((response: any) => {
                expect(response).to.have.status(406);
            });
    });

});