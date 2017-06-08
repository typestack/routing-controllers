import "reflect-metadata";
import {Get} from "../../src/decorator/Get";
import {createExpressServer, createKoaServer, getMetadataArgsStorage} from "../../src/index";
import {assertRequest} from "./test-utils";
import {JsonController} from "../../src/decorator/JsonController";
import {Authorized} from "../../src/decorator/Authorized";
import {Action} from "../../src/Action";
import {RoutingControllersOptions} from "../../src/RoutingControllersOptions";
const chakram = require("chakram");
const expect = chakram.expect;

describe("Authorized Decorators Http Status Code", function () {

    before(() => {

        // reset metadata args storage
        getMetadataArgsStorage().reset();

        @JsonController()
        class AuthController {

            @Authorized()
            @Get("/auth1")
            auth1() {
                return {test: "auth1"};
            }

            @Authorized(["role1"])
            @Get("/auth2")
            auth2() {
                return {test: "auth2"};
            }

        }
    });

    const serverOptions: RoutingControllersOptions = {
        authorizationChecker: async (action: Action, roles?: string[]) => {
            return false;
        }
    };

    let expressApp: any;
    before(done => {
        const server = createExpressServer(serverOptions);
        expressApp = server.listen(3001, done);
    });
    after(done => expressApp.close(done));

    let koaApp: any;
    before(done => {
        const server = createKoaServer(serverOptions);
        koaApp = server.listen(3002, done);
    });
    after(done => koaApp.close(done));

    describe("without roles", () => {
        assertRequest([3001, 3002], "get", "auth1", response => {
            expect(response).to.have.status(401);
        });
    });

    describe("with roles", () => {
        assertRequest([3001, 3002], "get", "auth2", response => {
            expect(response).to.have.status(403);
        });
    });

});