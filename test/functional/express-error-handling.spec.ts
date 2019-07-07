import "reflect-metadata";
import {JsonController} from "../../src/decorator/JsonController";
import {createExpressServer, getMetadataArgsStorage} from "../../src/index";
import {Get} from "../../src/decorator/Get";
import {Middleware} from "../../src/decorator/Middleware";
import {UseAfter} from "../../src/decorator/UseAfter";
import {ExpressErrorMiddlewareInterface} from "../../src/driver/express/ExpressErrorMiddlewareInterface";
import {NotFoundError} from "../../src/http-error/NotFoundError";
import {HttpError} from "../../src/http-error/HttpError";
const chakram = require("chakram");
const expect = chakram.expect;

describe("express error handling", () => {

    let errorHandlerCalled: boolean,
        errorHandledSpecifically: boolean;

    beforeEach(() => {
        errorHandlerCalled = undefined;
        errorHandledSpecifically = undefined;
    });

    before(() => {

        // reset metadata args storage
        getMetadataArgsStorage().reset();

        @Middleware({ type: "after" })
        class AllErrorsHandler implements ExpressErrorMiddlewareInterface {

            error(error: any, request: any, response: any, next?: Function): any {
                errorHandlerCalled = true;
                // ERROR HANDLED GLOBALLY
                next(error);
            }

        }

        class SpecificErrorHandler implements ExpressErrorMiddlewareInterface {

            error(error: any, request: any, response: any, next?: Function): any {
                errorHandledSpecifically = true;
                // ERROR HANDLED SPECIFICALLY
                next(error);
            }

        }

        class SoftErrorHandler implements ExpressErrorMiddlewareInterface {

            error(error: any, request: any, response: any, next?: Function): any {
                // ERROR WAS IGNORED
                next();
            }

        }

        class ToJsonError extends HttpError {
            public publicData: string;
            public secretData: string;

            constructor(httpCode: number, publicMsg?: string, privateMsg?: string) {
                super(httpCode);
                Object.setPrototypeOf(this, ToJsonError.prototype);
                this.publicData = publicMsg || "public";
                this.secretData = privateMsg || "secret";
            }

            toJSON() {
                return {
                    status: this.httpCode,
                    publicData: `${this.publicData} (${this.httpCode})`
                };
            }
        }

        @JsonController()
        class ExpressErrorHandlerController {

            @Get("/blogs")
            blogs() {
                return {
                    id: 1,
                    title: "About me"
                };
            }

            @Get("/posts")
            posts() {
                throw new Error("System error, cannot retrieve posts");
            }

            @Get("/videos")
            videos() {
                throw new NotFoundError("Videos were not found.");
            }

            @Get("/questions")
            @UseAfter(SpecificErrorHandler)
            questions() {
                throw new Error("Something is wrong... Cannot load questions");
            }

            @Get("/files")
            @UseAfter(SoftErrorHandler)
            files() {
                throw new Error("Something is wrong... Cannot load files");
            }

            @Get("/photos")
            /*@UseAfter(function (error: any, request: any, response: any, next: Function) {
                useAfter = true;
                useCallOrder = "setFromUseAfter";
                next();
            })*/
            photos() {
                return "1234";
            }

            @Get("/stories")
            stories() {
                throw new ToJsonError(503, "sorry, try it again later", "impatient user");
            }

        }
    });

    let app: any;
    before(done => app = createExpressServer().listen(3001, done));
    after(done => app.close(done));

    it("should not call global error handler middleware if there was no errors", () => {
        return chakram
            .get("http://127.0.0.1:3001/blogs")
            .then((response: any) => {
                expect(errorHandlerCalled).to.be.empty;
                expect(errorHandledSpecifically).to.be.empty;
                expect(response).to.have.status(200);
            });
    });

    it("should call global error handler middleware", () => {
        return chakram
            .get("http://127.0.0.1:3001/posts")
            .then((response: any) => {
                expect(errorHandlerCalled).to.be.true;
                expect(errorHandledSpecifically).to.be.empty;
                expect(response).to.have.status(500);
            });
    });

    it("should call global error handler middleware", () => {
        return chakram
            .get("http://127.0.0.1:3001/videos")
            .then((response: any) => {
                expect(errorHandlerCalled).to.be.true;
                expect(errorHandledSpecifically).to.be.empty;
                expect(response).to.have.status(404);
            });
    });

    it("should call error handler middleware if used", () => {
        return chakram
            .get("http://127.0.0.1:3001/questions")
            .then((response: any) => {
                expect(errorHandlerCalled).to.be.true;
                expect(errorHandledSpecifically).to.be.true;
                expect(response).to.have.status(500);
            });
    });

    it("should not execute next middleware if soft error handled specifically and stopped error bubbling", () => {
        return chakram
            .get("http://127.0.0.1:3001/files")
            .then((response: any) => {
                expect(errorHandlerCalled).to.be.empty;
                expect(errorHandledSpecifically).to.be.empty;
                expect(response).to.have.status(500);
            });
    });

    it("should process JsonErrors by their toJSON method if it exists", () => {
        return chakram
            .get("http://127.0.0.1:3001/stories")
            .then((response: any) => {
                expect(response).to.have.status(503);
                expect(response.body).to.have.property("status").and.equals(503);
                expect(response.body).to.have.property("publicData").and.equals("sorry, try it again later (503)");
                expect(response.body).to.not.have.property("secretData");
            });
    });

});
