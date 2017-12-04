import "reflect-metadata";
import {JsonController} from "../../src/decorator/JsonController";
import {Post} from "../../src/decorator/Post";
import {Body} from "../../src/decorator/Body";
import {createExpressServer, createKoaServer, getMetadataArgsStorage} from "../../src/index";
import {assertRequest} from "./test-utils";
const expect = require("chakram").expect;

export class User {
    firstName: string;
    lastName: string;

    toJSON() {
        return {firstName: this.firstName}; // lastName is excluded when class-transformer is disabled
    }
}

describe("action options", () => {

    let initializedUser: User;

    function handler(user: User) {
        initializedUser = user;
        const ret = new User();
        ret.firstName = user.firstName;
        ret.lastName = user.lastName || "default";
        return ret;
    }

    beforeEach(() => {
        initializedUser = undefined;
    });

    before(() => {

        // reset metadata args storage
        getMetadataArgsStorage().reset();

        @JsonController("", {transformResponse: false})
        class DefaultController {
            @Post("/default")
            default(@Body() user: User) { return handler(user); }

            @Post("/override", {transformRequest: false, transformResponse: true})
            transform(@Body() user: User) { return handler(user); }
        }
    });

    let expressApp: any, koaApp: any;
    before(done => expressApp = createExpressServer().listen(3001, done));
    after(done => expressApp.close(done));
    before(done => koaApp = createKoaServer().listen(3002, done));
    after(done => koaApp.close(done));

    describe("use controller options when action transform options are not set", () => {
        assertRequest([3001, 3002], "post", "default", { firstName: "Umed", lastName: "Khudoiberdiev" }, response => {
            expect(initializedUser).to.be.instanceOf(User);
            expect(response).to.have.status(200);
            expect(response.body.lastName).to.be.defined;
        });
    });

    describe("override controller options when action transform options are set", () => {
        assertRequest([3001, 3002], "post", "override", { firstName: "Umed", lastName: "Khudoiberdiev" }, response => {
            expect(initializedUser).not.to.be.instanceOf(User);
            expect(response).to.have.status(200);
            expect(response.body.lastName).to.be.defined;
        });
    });
});
