import "reflect-metadata";
import {JsonController} from "../../src/decorator/JsonController";
import {Post} from "../../src/decorator/Post";
import {Body} from "../../src/decorator/Body";
import {createExpressServer, createKoaServer, getMetadataArgsStorage} from "../../src/index";
import {assertRequest} from "./test-utils";
const chakram = require("chakram");
const expect = chakram.expect;

export class User {
    firstName: string;
    lastName: string;

    toJSON() {
        return {firstName: this.firstName}; // lastName is excluded when class-transformer is disabled
    }
}

describe("routing-controllers global options", () => {

    let initializedUser: User;

    beforeEach(() => {
        initializedUser = undefined;
    });

    before(() => {

        // reset metadata args storage
        getMetadataArgsStorage().reset();

        @JsonController()
        class TestUserController {

            @Post("/users")
            postUsers(@Body() user: User) {
                initializedUser = user;
                const ret = new User();
                ret.firstName = user.firstName;
                ret.lastName = user.lastName || "default";
                return ret;
            }

            @Post(new RegExp("/(prefix|regex)/users"))
            postUsersWithRegex(@Body() user: User) {
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
            expect(response.body.lastName).to.be.defined;
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
            expect(response.body.lastName).to.be.defined;
        });
    });

    describe("when useClassTransformer is set to false", () => {

        let expressApp: any, koaApp: any;
        before(done => expressApp = createExpressServer({ classTransformer: false }).listen(3001, done));
        after(done => expressApp.close(done));
        before(done => koaApp = createKoaServer({ classTransformer: false }).listen(3002, done));
        after(done => koaApp.close(done));

        assertRequest([3001, 3002], "post", "users", { firstName: "Umed", lastName: "Khudoiberdiev" }, response => {
            expect(initializedUser).not.to.be.instanceOf(User);
            expect(response).to.have.status(200);
            expect(response.body.lastName).to.be.undefined;
        });
    });

    describe("when routePrefix is used all controller routes should be appended by it", () => {

        let apps: any[] = [];
        before(done => apps.push(createExpressServer({ routePrefix: "/api" }).listen(3001, done)));
        before(done => apps.push(createExpressServer({ routePrefix: "api" }).listen(3002, done)));
        before(done => apps.push(createKoaServer({ routePrefix: "/api" }).listen(3003, done)));
        before(done => apps.push(createKoaServer({ routePrefix: "api" }).listen(3004, done)));
        after(done => { apps.forEach(app => app.close()); done(); });

        assertRequest([3001, 3002, 3003, 3004], "post", "api/users", { firstName: "Umed", lastName: "Khudoiberdiev" }, response => {
            expect(initializedUser).to.be.instanceOf(User);
            expect(response).to.have.status(200);
        });

        assertRequest([3001, 3002, 3003, 3004], "post", "api/regex/users", { firstName: "Umed", lastName: "Khudoiberdiev" }, response => {
            expect(initializedUser).to.be.instanceOf(User);
            expect(response).to.have.status(200);
        });
    });

});
