import "reflect-metadata";
import {JsonController} from "../../src/deprecated/JsonController";
import {Controller} from "../../src/decorator/Controller";
import {Get} from "../../src/decorator/Get";
import {Req} from "../../src/decorator/Req";
import {Res} from "../../src/decorator/Res";
import {Param} from "../../src/decorator/Param";
import {Post} from "../../src/decorator/Post";
import {UseBefore} from "../../src/decorator/UseBefore";
import {Session} from "../../src/decorator/Session";
import {State} from "../../src/decorator/State";
import {QueryParam} from "../../src/decorator/QueryParam";
import {HeaderParam} from "../../src/decorator/HeaderParam";
import {CookieParam} from "../../src/decorator/CookieParam";
import {Body} from "../../src/decorator/Body";
import {BodyParam} from "../../src/decorator/BodyParam";
import {UploadedFile} from "../../src/decorator/UploadedFile";
import {UploadedFiles} from "../../src/decorator/UploadedFiles";
import {JsonResponse} from "../../src/deprecated/JsonResponse";
import {Method} from "../../src/decorator/Method";
import {Head} from "../../src/decorator/Head";
import {Delete} from "../../src/decorator/Delete";
import {Patch} from "../../src/decorator/Patch";
import {Put} from "../../src/decorator/Put";
import {Middleware} from "../../src/decorator/Middleware";
import {UseAfter} from "../../src/decorator/UseAfter";
import {createExpressServer, defaultMetadataArgsStorage, createKoaServer} from "../../src/index";
import {assertRequest} from "./test-utils";
const chakram = require("chakram");
const expect = chakram.expect;

export class User {
    firstName: string;
    lastName: string;
    getName(): string {
        return this.firstName + " " + this.lastName;
    }
}

describe("routing-controllers global options", () => {

    let initializedUser: User;

    beforeEach(() => {
        initializedUser = undefined;
    });

    before(() => {

        // reset metadata args storage
        defaultMetadataArgsStorage().reset();

        @JsonController()
        class TestUserController {

            @Post("/users")
            postUsers(@Body() user: User) {
                initializedUser = user;
                return "";
            }
            
        }
    });

    describe("useClassTransformer by default must be set to true", () => {

        let expressApp: any, koaApp: any;
        before(done => expressApp = createExpressServer().listen(3001, done));
        after(done => expressApp.close(done));
        before(done => koaApp = createKoaServer().listen(3002, done));
        after(done => koaApp.close(done));

        assertRequest([3001, 3002], "post", "users", { firstName: "Umed", lastName: "Khudoiberdiev" }, response => {
            expect(initializedUser).to.be.instanceOf(User);
            expect(response).to.have.status(200);
        });
    });

    describe("when useClassTransformer is set to true", () => {

        let expressApp: any, koaApp: any;
        before(done => expressApp = createExpressServer({ useClassTransformer: true }).listen(3001, done));
        after(done => expressApp.close(done));
        before(done => koaApp = createKoaServer({ useClassTransformer: true }).listen(3002, done));
        after(done => koaApp.close(done));

        assertRequest([3001, 3002], "post", "users", { firstName: "Umed", lastName: "Khudoiberdiev" }, response => {
            expect(initializedUser).to.be.instanceOf(User);
            expect(response).to.have.status(200);
        });
    });

    describe("when useClassTransformer is not set", () => {

        let expressApp: any, koaApp: any;
        before(done => expressApp = createExpressServer({ useClassTransformer: false }).listen(3001, done));
        after(done => expressApp.close(done));
        before(done => koaApp = createKoaServer({ useClassTransformer: false }).listen(3002, done));
        after(done => koaApp.close(done));
    
        assertRequest([3001, 3002], "post", "users", { firstName: "Umed", lastName: "Khudoiberdiev" }, response => {
            expect(initializedUser).not.to.be.instanceOf(User);
            expect(response).to.have.status(200);
        });
    });

    describe("when routePrefix is used all controller routes should be appended by it", () => {
    
        let expressApp: any, koaApp: any;
        before(done => expressApp = createExpressServer({ routePrefix: "/api" }).listen(3001, done));
        after(done => expressApp.close(done));
        before(done => koaApp = createKoaServer({ routePrefix: "/api" }).listen(3002, done));
        after(done => koaApp.close(done));
    
        assertRequest([3001, 3002], "post", "api/users", { firstName: "Umed", lastName: "Khudoiberdiev" }, response => {
            expect(response).to.have.status(200);
        });
    });

});