import "reflect-metadata";
import {createReadStream} from "fs";
import * as path from "path";
import {createExpressServer, getMetadataArgsStorage} from "../../src/index";
import {JsonController} from "../../src/decorator/JsonController";
import {Get} from "../../src/decorator/Get";
import {ContentType} from "../../src/decorator/ContentType";
import {AxiosResponse} from "axios";
import {Server as HttpServer} from "http";
import HttpStatusCodes from "http-status-codes";
import DoneCallback = jest.DoneCallback;
import {axios} from "../utilities/axios";

describe("special result value treatment", () => {
    let expressServer: HttpServer;
    const rawData = [0xFF, 0x66, 0xAA, 0xCC];

    beforeAll((done: DoneCallback) => {
        getMetadataArgsStorage().reset();

        @JsonController()
        class HandledController {
            @Get("/stream")
            @ContentType("text/plain")
            getStream() {
                return createReadStream(path.resolve(__dirname, "../resources/sample-text-file-one.txt"));
            }

            @Get("/buffer")
            @ContentType("application/octet-stream")
            getBuffer() {
                return Buffer.from(rawData);
            }

            @Get("/array")
            @ContentType("application/octet-stream")
            getUIntArray() {
                return new Uint8Array(rawData);
            }
        }

        expressServer = createExpressServer().listen(3001, done);
    });

    afterAll((done: DoneCallback) => expressServer.close(done));

    it("should pipe stream to response", () => {
        expect.assertions(3);
        return axios.get("/stream")
            .then(async (response: AxiosResponse) => {
            expect(response.status).toEqual(HttpStatusCodes.OK);
            expect(response.headers["content-type"]).toEqual("text/plain; charset=utf-8");
            expect(response.data).toEqual("Hello World!");
        });
    });

    it("should send raw binary data from Buffer", () => {
        expect.assertions(3);
        return axios.get("/buffer")
            .then((response: AxiosResponse) => {
                expect(response.status).toEqual(HttpStatusCodes.OK);
                expect(response.headers["content-type"]).toEqual("application/octet-stream");
                expect(response.data).toEqual(Buffer.from(rawData).toString());
            });
    });

    it("should send raw binary data from UIntArray", () => {
        expect.assertions(3);
        return axios.get("/array")
            .then((response: AxiosResponse) => {
                expect(response.status).toEqual(HttpStatusCodes.OK);
                expect(response.headers["content-type"]).toEqual("application/octet-stream");
                expect(response.data).toEqual(Buffer.from(rawData).toString());
            });
    });
});
