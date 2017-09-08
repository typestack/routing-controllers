import "reflect-metadata";

import {createReadStream} from "fs";
import * as path from "path";
import {createExpressServer, createKoaServer, getMetadataArgsStorage} from "../../src/index";
import {assertRequest} from "./test-utils";
import {InterceptorInterface} from "../../src/InterceptorInterface";
import {Interceptor} from "../../src/decorator/Interceptor";
import {UseInterceptor} from "../../src/decorator/UseInterceptor";
import {Controller} from "../../src/decorator/Controller";
import {Get} from "../../src/decorator/Get";
import {Action} from "../../src/Action";
import {ContentType} from "../../src/decorator/ContentType";
const chakram = require("chakram");
const expect = chakram.expect;

describe("special result value treatment", () => {

    const rawData = [0xFF, 0x66, 0xAA, 0xCC];

    before(() => {

        // reset metadata args storage
        getMetadataArgsStorage().reset();

        @Controller()
        class HandledController {

            @Get("/stream")
            @ContentType("text/plain")
            getStream() {
                return createReadStream(path.resolve(__dirname, "../../../../test/resources/sample-text-file.txt"));
            }

            @Get("/buffer")
            getBuffer() {
                return new Buffer(rawData);
            }
        }

    });

    let expressApp: any, koaApp: any;
    before(done => expressApp = createExpressServer().listen(3001, done));
    after(done => expressApp.close(done));
    before(done => koaApp = createKoaServer().listen(3002, done));
    after(done => koaApp.close(done));

    describe("should pipe stream to response", () => {
        assertRequest([3001, 3002], "get", "stream", response => {
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", (contentType: string) => {
                expect(contentType).to.match(/text\/plain/);
            });
            expect(response.body).to.be.equal("Hello World!");
        });
    });

    describe("should send raw binary data", () => {
        assertRequest([3001, 3002], "get", "buffer", response => {
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "application/octet-stream");
            expect(response.body).to.be.equal(new Buffer(rawData).toString());
        });
    });
});
