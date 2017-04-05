import "reflect-metadata";
import {JsonController} from "../../src/decorator/JsonController";
import {Get} from "../../src/decorator/Method";
import {createExpressServer, defaultMetadataArgsStorage} from "../../src/index";
import {MiddlewareGlobalAfter, UseBefore, UseAfter, Middleware} from "../../src/decorator/JsonResponse";
import {ErrorMiddlewareInterface} from "../../src/middleware/ErrorMiddlewareInterface";
import {NotFoundError} from "../../src/http-error/NotFoundError";
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
        defaultMetadataArgsStorage().reset();

        @MiddlewareGlobalAfter()
        class AllErrorsHandler implements ErrorMiddlewareInterface {

            error(error: any, request: any, response: any, next?: Function): any {
                errorHandlerCalled = true;
                console.log("ERROR HANDLED GLOBALLY: ", error);
                next(error);
            }

        }

        @Middleware()
        class SpecificErrorHandler implements ErrorMiddlewareInterface {

            error(error: any, request: any, response: any, next?: Function): any {
                errorHandledSpecifically = true;
                console.log("ERROR HANDLED SPECIFICALLY: ", error);
                next(error);
            }

        }

        @Middleware()
        class SoftErrorHandler implements ErrorMiddlewareInterface {

            error(error: any, request: any, response: any, next?: Function): any {
                console.log("ERROR WAS IGNORED: ", error);
                next();
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

});