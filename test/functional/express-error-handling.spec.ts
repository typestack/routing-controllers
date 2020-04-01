import "reflect-metadata";
import {JsonController} from "../../src/decorator/JsonController";
import {createExpressServer, getMetadataArgsStorage} from "../../src/index";
import {Get} from "../../src/decorator/Get";
import {Middleware} from "../../src/decorator/Middleware";
import {UseAfter} from "../../src/decorator/UseAfter";
import {ExpressErrorMiddlewareInterface} from "../../src/driver/express/ExpressErrorMiddlewareInterface";
import {NotFoundError} from "../../src/http-error/NotFoundError";
import {HttpError} from "../../src/http-error/HttpError";
import {AxiosError, AxiosResponse} from "axios";
import {Server as HttpServer} from "http";
import HttpStatusCodes from "http-status-codes";
import DoneCallback = jest.DoneCallback;
import express from "express";
import {axios} from "../utilities/axios";

describe("express error handling", () => {
    let expressServer: HttpServer;
    let errorHandlerCalled: boolean;
    let errorHandledSpecifically: boolean;

    beforeEach(() => {
        errorHandlerCalled = undefined;
        errorHandledSpecifically = undefined;
    });

    beforeAll((done: DoneCallback) => {
        getMetadataArgsStorage().reset();

        @Middleware({ type: "after" })
        class AllErrorsHandler implements ExpressErrorMiddlewareInterface {
            error(error: HttpError, request: express.Request, response: express.Response, next: express.NextFunction): any {
                errorHandlerCalled = true;
                // ERROR HANDLED GLOBALLY
                next(error);
            }
        }

        class SpecificErrorHandler implements ExpressErrorMiddlewareInterface {
            error(error: HttpError, request: express.Request, response: express.Response, next: express.NextFunction): any {
                errorHandledSpecifically = true;
                // ERROR HANDLED SPECIFICALLY
                next(error);
            }
        }

        class SoftErrorHandler implements ExpressErrorMiddlewareInterface {
            error(error: HttpError, request: express.Request, response: express.Response, next: express.NextFunction): any {
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
            photos() {
                return "1234";
            }

            @Get("/stories")
            stories() {
                throw new ToJsonError(503, "sorry, try it again later", "impatient user");
            }
        }

        expressServer = createExpressServer().listen(3001, done);
    });

    afterAll((done: DoneCallback) => expressServer.close(done));

    it("should not call global error handler middleware if there was no errors", () => {
        expect.assertions(2);
        return axios.get("/blogs")
            .then((response: AxiosResponse) => {
                expect(errorHandlerCalled).toBeFalsy();
                expect(response.status).toEqual(HttpStatusCodes.OK);
            });
    });

    it("should call global error handler middleware", () => {
        expect.assertions(3);
        return axios.get("/posts")
            .catch((error: AxiosError) => {
                expect(errorHandlerCalled).toBeTruthy();
                expect(errorHandledSpecifically).toBeFalsy();
                expect(error.response.status).toEqual(HttpStatusCodes.INTERNAL_SERVER_ERROR);
            });
    });

    it("should call global error handler middleware", () => {
        expect.assertions(3);
        return axios.get("/videos")
            .catch((error: AxiosError) => {
                expect(errorHandlerCalled).toBeTruthy();
                expect(errorHandledSpecifically).toBeFalsy();
                expect(error.response.status).toEqual(HttpStatusCodes.NOT_FOUND);
            });
    });

    it("should call error handler middleware if used", () => {
        expect.assertions(3);
        return axios.get("/questions")
            .catch((error: AxiosError) => {
                expect(errorHandlerCalled).toBeTruthy();
                expect(errorHandledSpecifically).toBeTruthy();
                expect(error.response.status).toEqual(HttpStatusCodes.INTERNAL_SERVER_ERROR);
            });
    });

    it("should not execute next middleware if soft error handled specifically and stopped error bubbling", () => {
        expect.assertions(3);
        return axios.get("/files")
            .catch((error: AxiosError) => {
                expect(errorHandlerCalled).toBeFalsy();
                expect(errorHandledSpecifically).toBeFalsy();
                expect(error.response.status).toEqual(HttpStatusCodes.INTERNAL_SERVER_ERROR);
            });
    });

    it("should process JsonErrors by their toJSON method if it exists", () => {
        expect.assertions(4);
        return axios.get("/stories")
            .catch((error: AxiosError) => {
                expect(error.response.status).toEqual(HttpStatusCodes.SERVICE_UNAVAILABLE);
                expect(error.response.data.status).toEqual(HttpStatusCodes.SERVICE_UNAVAILABLE);
                expect(error.response.data.publicData).toEqual("sorry, try it again later (503)");
                expect(error.response.data.secretData).toBeUndefined();
            });
    });
});
