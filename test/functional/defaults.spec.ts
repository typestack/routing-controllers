import "reflect-metadata";
import {createExpressServer, getMetadataArgsStorage} from "../../src/index";
import {Controller} from "../../src/decorator/Controller";
import {Get} from "../../src/decorator/Get";
import {QueryParam} from "../../src/decorator/QueryParam";
import {OnUndefined} from "../../src/decorator/OnUndefined";
import {AxiosError, AxiosResponse} from "axios";
import {Server as HttpServer} from "http";
import HttpStatusCodes from "http-status-codes";
import DoneCallback = jest.DoneCallback;
import {axios} from "../utilities/axios";

describe("defaults", () => {
    let expressServer: HttpServer;
    const defaultUndefinedResultCode = 204;
    const defaultNullResultCode = 404;

    beforeAll((done: DoneCallback) => {
        getMetadataArgsStorage().reset();

        @Controller()
        class ExpressController {
            @Get("/voidfunc")
            voidFunc() {
                // Empty
            }

            @Get("/promisevoidfunc")
            promiseVoidFunc() {
                return Promise.resolve();
            }

            @Get("/paramfunc")
            paramFunc(@QueryParam("x") x: number) {
                return {
                    foo: "bar"
                };
            }

            @Get("/nullfunc")
            nullFunc(): string {
                return null;
            }

            @Get("/overridefunc")
            @OnUndefined(HttpStatusCodes.NOT_ACCEPTABLE)
            overrideFunc() {
                // Empty
            }

            @Get("/overrideparamfunc")
            overrideParamFunc(@QueryParam("x", {required: false}) x: number) {
                return {
                    foo: "bar"
                };
            }
        }

        expressServer = createExpressServer({
            defaults: {
                nullResultCode: defaultNullResultCode,
                undefinedResultCode: defaultUndefinedResultCode,
                paramOptions: {
                    required: true
                }
            }
        }).listen(3001, done);
    });

    afterAll((done: DoneCallback) => expressServer.close(done));

    it("should return undefinedResultCode from defaults config for void function", () => {
        expect.assertions(1);
        return axios.get("/voidfunc")
            .then((response: AxiosResponse) => {
                expect(response.status).toEqual(defaultUndefinedResultCode);
            });
    });

    it("should return undefinedResultCode from defaults config for promise void function", () => {
        expect.assertions(1);
        return axios.get("/promisevoidfunc")
            .then((response: AxiosResponse) => {
                expect(response.status).toEqual(defaultUndefinedResultCode);
            });
    });

    it("should return 400 from required paramOptions", () => {
        expect.assertions(1);
        return axios.get("/paramfunc")
            .catch((error: AxiosError) => {
                expect(error.response.status).toEqual(HttpStatusCodes.BAD_REQUEST);
            });
    });

    it("should return nullResultCode from defaults config", () => {
        expect.assertions(1);
        return axios.get("/nullfunc")
            .catch((error: AxiosError) => {
                expect(error.response.status).toEqual(defaultNullResultCode);
            });
    });

    it("should return status code from OnUndefined annotation", () => {
        expect.assertions(1);
        return axios.get("/overridefunc")
            .catch((error: AxiosError) => {
                expect(error.response.status).toEqual(HttpStatusCodes.NOT_ACCEPTABLE);
            });
    });

    it("should mark arg optional from QueryParam annotation", () => {
        expect.assertions(1);
        return axios.get("/overrideparamfunc")
            .then((response: AxiosResponse) => {
                expect(response.status).toEqual(HttpStatusCodes.OK);
            });
    });
});
