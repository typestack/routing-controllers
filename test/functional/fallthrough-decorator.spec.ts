import "reflect-metadata";
import {Controller} from "../../src/decorator/Controller";
import {Fallthrough} from "../../src/decorator/Fallthrough";
import {UseAfter} from "../../src/decorator/UseAfter";
import {Get} from "../../src/decorator/Get";
import {createExpressServer, createKoaServer, getMetadataArgsStorage} from "../../src/index";
import {assertRequest} from "./test-utils";
const chakram = require("chakram");
const expect = chakram.expect;

describe("fallthrough-decorator behavior", () => {
    let useAfter: boolean;

    beforeEach(() => {
        useAfter = undefined;
    });

    before(() => {
        // reset metadata args storage
        getMetadataArgsStorage().reset();

        @Controller()
        class FallthroughController {
            @Get("/books")
            @Fallthrough()
            @UseAfter(function(req: any, res: any, next: (err?: any) => any) {
                useAfter = true;
            })
            getAll() {
                return "<html><body>All books</body></html>";
            }
        }
    });

    let expressApp: any, koaApp: any;
    before(done => expressApp = createExpressServer().listen(3001, done));
    after(done => expressApp.close(done));
    before(done => koaApp = createKoaServer().listen(3002, done));
    after(done => koaApp.close(done));

    describe("get should respond with proper status code, headers and body content, and should call after middleware", () => {
        assertRequest([3001, 3002], "get", "books", response => {
            expect(response).to.have.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            expect(response.body).to.be.equal("<html><body>All books</body></html>");
            expect(useAfter).to.be.equal(true);
        });
    });

});