import "reflect-metadata";
import {JsonController} from "../../src/decorator/JsonController";
import {Post} from "../../src/decorator/Post";
import {Body} from "../../src/decorator/Body";
import {createExpressServer, createKoaServer, defaultMetadataArgsStorage} from "../../src/index";
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
        before(done => expressApp = createExpressServer({ classTransformer: true }).listen(3001, done));
        after(done => expressApp.close(done));
        before(done => koaApp = createKoaServer({ classTransformer: true }).listen(3002, done));
        after(done => koaApp.close(done));

        assertRequest([3001, 3002], "post", "users", { firstName: "Umed", lastName: "Khudoiberdiev" }, response => {
            expect(initializedUser).to.be.instanceOf(User);
            expect(response).to.have.status(200);
        });
    });

    describe("when useClassTransformer is not set", () => {

        let expressApp: any, koaApp: any;
        before(done => expressApp = createExpressServer({ classTransformer: false }).listen(3001, done));
        after(done => expressApp.close(done));
        before(done => koaApp = createKoaServer({ classTransformer: false }).listen(3002, done));
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