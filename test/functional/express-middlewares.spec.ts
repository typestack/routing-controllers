import "reflect-metadata";
import {createExpressServer, getMetadataArgsStorage} from "../../src/index";
import {ExpressMiddlewareInterface} from "../../src/driver/express/ExpressMiddlewareInterface";
import {Controller} from "../../src/decorator/Controller";
import {Get} from "../../src/decorator/Get";
import {UseBefore} from "../../src/decorator/UseBefore";
import {Middleware} from "../../src/decorator/Middleware";
import {UseAfter} from "../../src/decorator/UseAfter";
import {NotAcceptableError} from "./../../src/http-error/NotAcceptableError";
import {AxiosError, AxiosResponse} from "axios";
import {Server as HttpServer} from "http";
import HttpStatusCodes from "http-status-codes";
import DoneCallback = jest.DoneCallback;
import express from "express";
import {axios} from "../utilities/axios";

describe("express middlewares", () => {
    let expressServer: HttpServer;
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

    beforeAll((done: DoneCallback) => {
        getMetadataArgsStorage().reset();

        @Middleware({ type: "before" })
        class TestGlobalBeforeMidleware implements ExpressMiddlewareInterface {
            use(request: express.Request, response: express.Response, next: express.NextFunction): any {
                useGlobalBefore = true;
                useGlobalCallOrder = "setFromGlobalBefore";
                next();
            }
        }

        @Middleware({ type: "after" })
        class TestGlobalAfterMidleware implements ExpressMiddlewareInterface {
            use(request: express.Request, response: express.Response, next: express.NextFunction): any {
                useGlobalAfter = true;
                useGlobalCallOrder = "setFromGlobalAfter";
                next();
            }
        }

        class TestLoggerMiddleware implements ExpressMiddlewareInterface {
            use(request: express.Request, response: express.Response, next: express.NextFunction): any {
                useCustom = true;
                next();
            }
        }

        class TestCustomMiddlewareWhichThrows implements ExpressMiddlewareInterface {
            use(request: express.Request, response: express.Response, next: express.NextFunction): any {
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

            @Get("/customMiddlewareWichThrows")
            @UseBefore(TestCustomMiddlewareWhichThrows)
            customMiddlewareWichThrows() {
                return "1234";
            }
        }

        expressServer = createExpressServer().listen(3001, done);
    });

    afterAll((done: DoneCallback) => expressServer.close(done));

    it("should call a global middlewares", () => {
        expect.assertions(4);
        return axios.get("/blogs")
            .then((response: AxiosResponse) => {
                expect(useGlobalBefore).toEqual(true);
                expect(useGlobalAfter).toEqual(true);
                expect(useGlobalCallOrder).toEqual("setFromGlobalAfter");
                expect(response.status).toEqual(HttpStatusCodes.OK);
            });
    });

    it("should use a custom middleware when @UseBefore or @UseAfter is used", () => {
        expect.assertions(2);
        return axios.get("/questions")
            .then((response: AxiosResponse) => {
                expect(useCustom).toEqual(true);
                expect(response.status).toEqual(HttpStatusCodes.OK);
            });
    });

    it("should call middleware and call it before controller action when @UseBefore is used", () => {
        expect.assertions(3);
        return axios.get("/users")
            .then((response: AxiosResponse) => {
                expect(useBefore).toEqual(true);
                expect(useCallOrder).toEqual("setFromController");
                expect(response.status).toEqual(HttpStatusCodes.OK);
            });
    });

    it("should call middleware and call it after controller action when @UseAfter is used", () => {
        expect.assertions(3);
        return axios.get("/photos")
            .then((response: AxiosResponse) => {
                expect(useAfter).toEqual(true);
                expect(useCallOrder).toEqual("setFromUseAfter");
                expect(response.status).toEqual(HttpStatusCodes.OK);
            });
    });

    it("should call before middleware and call after middleware when @UseAfter and @UseAfter are used", () => {
        expect.assertions(4);
        return axios.get("/posts")
            .then((response: AxiosResponse) => {
                expect(useBefore).toEqual(true);
                expect(useAfter).toEqual(true);
                expect(useCallOrder).toEqual("setFromUseAfter");
                expect(response.status).toEqual(HttpStatusCodes.OK);
            });
    });

    it("should handle errors in custom middlewares", () => {
        expect.assertions(1);
        return axios.get("/customMiddlewareWichThrows")
            .catch((error: AxiosError) => {
                expect(error.response.status).toEqual(HttpStatusCodes.NOT_ACCEPTABLE);
            });
    });
});
