import "reflect-metadata";
import {createExpressServer, defaultMetadataArgsStorage} from "../../src/index";
import {MiddlewareInterface} from "../../src/middleware/MiddlewareInterface";
import {Controller} from "../../src/decorator/Controller";
import {Get} from "../../src/decorator/Get";
import {Req} from "../../src/decorator/Req";
import {Res} from "../../src/decorator/Res";
import {Param} from "../../src/decorator/Param";
import {Post} from "../../src/decorator/Post";
import {UseBefore} from "../../src/decorator/UseBefore";
import {Session} from "../../src/decorator/Session";
import {State} from "../../src/decorator/State";
import {QueryParam} from "../../src/decorator/QueryParam";
import {HeaderParam} from "../../src/decorator/HeaderParam";
import {CookieParam} from "../../src/decorator/CookieParam";
import {Body} from "../../src/decorator/Body";
import {BodyParam} from "../../src/decorator/BodyParam";
import {UploadedFile} from "../../src/decorator/UploadedFile";
import {UploadedFiles} from "../../src/decorator/UploadedFiles";
import {JsonResponse} from "../../src/deprecated/JsonResponse";
import {Method} from "../../src/decorator/Method";
import {Head} from "../../src/decorator/Head";
import {Delete} from "../../src/decorator/Delete";
import {Patch} from "../../src/decorator/Patch";
import {Put} from "../../src/decorator/Put";
import {Middleware} from "../../src/decorator/Middleware";
import {UseAfter} from "../../src/decorator/UseAfter";
const chakram = require("chakram");
const expect = chakram.expect;

describe("express middlewares", () => {

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

        @Middleware({ global: true })
        class TestGlobalBeforeMidleware implements MiddlewareInterface {

            use(request: any, response: any, next?: Function): any {
                useGlobalBefore = true;
                useGlobalCallOrder = "setFromGlobalBefore";
                next();
            }

        }

        @Middleware({ global: true, type: "after" })
        class TestGlobalAfterMidleware implements MiddlewareInterface {

            use(request: any, response: any, next?: Function): any {
                useGlobalAfter = true;
                useGlobalCallOrder = "setFromGlobalAfter";
                next();
            }

        }

        @Middleware()
        class TestLoggerMiddleware implements MiddlewareInterface {

            use(request: any, response: any, next?: Function): any {
                useCustom = true;
                next();
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
            @UseBefore(TestLoggerMiddleware)
            questions() {
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
    before(done => app = createExpressServer().listen(3001, done));
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

});