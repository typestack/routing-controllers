import "reflect-metadata";
import {JsonController} from "../../src/decorator/JsonController";
import {createExpressServer} from "../../src/index";
import {Get} from "../../src/decorator/Get";
import {Middleware} from "../../src/decorator/Middleware";
import {ExpressErrorMiddlewareInterface} from "../../src/driver/express/ExpressErrorMiddlewareInterface";
import {ExpressMiddlewareInterface} from "../../src/driver/express/ExpressMiddlewareInterface";
import {AxiosError} from "axios";
import {Server as HttpServer} from "http";
import HttpStatusCodes from "http-status-codes";
import DoneCallback = jest.DoneCallback;
import express from "express";
import {axios} from "../utilities/axios";

describe("custom express global before middleware error handling", () => {
    let errorHandlerCalled: boolean;
    let errorHandlerName: string;
    let expressServer: HttpServer;

    class CustomError extends Error {
        name = "CustomError";
        message = "custom error message!";
    }

    beforeEach(() => {
        errorHandlerCalled = undefined;
        errorHandlerName = undefined;
    });

    beforeAll((done: DoneCallback) => {
        @Middleware({type: "before"})
        class GlobalBeforeMiddleware implements ExpressMiddlewareInterface {
            use(request: express.Request, response: express.Response, next: express.NextFunction): any {
                throw new CustomError();
            }
        }

        @Middleware({type: "after"})
        class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
            error(error: any, req: any, res: any, next: any): void {
                errorHandlerCalled = true;
                errorHandlerName = error.name;
                res.status(error.httpCode || 500).send(error.message);
            }
        }

        @JsonController()
        class ExpressErrorHandlerController {
            @Get("/answers")
            answers(): any {
                return {
                    id: 1,
                    title: "My answer"
                };
            }
        }

        expressServer = createExpressServer().listen(3001, done);
    });

    afterAll((done: DoneCallback) => expressServer.close(done));

    it("should call global error handler middleware with CustomError", () => {
        expect.assertions(3);
        return axios.get("/answers")
            .catch((error: AxiosError) => {
                expect(errorHandlerCalled).toBeTruthy();
                expect(errorHandlerName).toEqual("CustomError");
                expect(error.response.status).toEqual(HttpStatusCodes.INTERNAL_SERVER_ERROR);
            });
    });
});
