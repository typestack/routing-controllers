import "reflect-metadata";
import {JsonController} from "../../src/decorator/JsonController";
import {Get} from "../../src/decorator/Get";
import {createExpressServer, getMetadataArgsStorage, HttpError} from "../../src/index";
import {ExpressErrorMiddlewareInterface} from "../../src/driver/express/ExpressErrorMiddlewareInterface";
import {NotFoundError} from "../../src/http-error/NotFoundError";
import {Middleware} from "../../src/decorator/Middleware";
import {AxiosError, AxiosResponse} from "axios";
import {Server as HttpServer} from "http";
import HttpStatusCodes from "http-status-codes";
import DoneCallback = jest.DoneCallback;
import express from "express";
import {axios} from "../utilities/axios";

describe("custom express error handling", () => {
    let errorHandlerCalled: boolean;
    let expressServer: HttpServer;

    beforeEach(() => {
        errorHandlerCalled = false;
    });

    beforeAll((done: DoneCallback) => {
        getMetadataArgsStorage().reset();

        @Middleware({ type: "after" })
        class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
            error(error: HttpError, request: express.Request, response: express.Response, next: express.NextFunction): any {
                errorHandlerCalled = true;
                response.status(error.httpCode).send(error.message);
            }
        }

        @JsonController()
        class ExpressErrorHandlerController {
            @Get("/blogs")
            blogs(): any {
                return {
                    id: 1,
                    title: "About me"
                };
            }

            @Get("/videos")
            videos(): never {
                throw new NotFoundError("Videos were not found.");
            }
        }

        expressServer = createExpressServer({
            defaultErrorHandler: false
        }).listen(3001, done);
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
        return axios.get("/videos")
            .catch((error: AxiosError) => {
                expect(errorHandlerCalled).toBeTruthy();
                expect(error.response.status).toEqual(HttpStatusCodes.NOT_FOUND);
                expect(error.response.data).toEqual("Videos were not found.")
            });
    });
});
