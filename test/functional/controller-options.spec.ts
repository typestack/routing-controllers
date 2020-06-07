import "reflect-metadata";
import {Exclude, Expose} from "class-transformer";
import {defaultMetadataStorage} from "class-transformer/storage";
import {JsonController} from "../../src/decorator/JsonController";
import {Post} from "../../src/decorator/Post";
import {Body} from "../../src/decorator/Body";
import {createExpressServer, createKoaServer, getMetadataArgsStorage} from "../../src/index";
import {assertRequest} from "./test-utils";
const expect = require("chakram").expect;

describe("controller options", () => {

    let initializedUser: any;
    let User: any;

    after(() => {
        defaultMetadataStorage.clear();
    });

    beforeEach(() => {
        initializedUser = undefined;
    });

    before(() => {

        // reset metadata args storage
        getMetadataArgsStorage().reset();

        @Exclude()
        class UserModel {
            @Expose()
            firstName: string;

            lastName: string;
        }
        User = UserModel;

        function handler(user: UserModel) {
            initializedUser = user;
            const ret = new User();
            ret.firstName = user.firstName;
            ret.lastName = user.lastName;
            return ret;
        }

        @JsonController("/default")
        class DefaultController {
            @Post("/")
            postUsers(@Body() user: UserModel) { return handler(user); }
        }

        @JsonController("/transform", {transformRequest: true, transformResponse: true})
        class TransformController {
            @Post("/")
            postUsers(@Body() user: UserModel) { return handler(user); }
        }

        @JsonController("/noTransform", {transformRequest: false, transformResponse: false})
        class NoTransformController {
            @Post("/")
            postUsers(@Body() user: UserModel) { return handler(user); }
        }

    });

    let expressApp: any, koaApp: any;
    before(done => expressApp = createExpressServer().listen(3001, done));
    after(done => expressApp.close(done));
    before(done => koaApp = createKoaServer().listen(3002, done));
    after(done => koaApp.close(done));

    describe("controller transform is enabled by default", () => {
        assertRequest([3001, 3002], "post", "default", { firstName: "Umed", lastName: "Khudoiberdiev" }, response => {
            expect(initializedUser).to.be.instanceOf(User);
            expect(initializedUser.lastName).to.be.undefined;
            expect(response).to.have.status(200);
            expect(response.body.lastName).to.be.undefined;
        });
    });

    describe("when controller transform is enabled", () => {
        assertRequest([3001, 3002], "post", "transform", { firstName: "Umed", lastName: "Khudoiberdiev" }, response => {
            expect(initializedUser).to.be.instanceOf(User);
            expect(initializedUser.lastName).to.be.undefined;
            expect(response).to.have.status(200);
            expect(response.body.lastName).to.be.undefined;
        });
    });

    describe("when controller transform is disabled", () => {
        assertRequest([3001, 3002], "post", "noTransform", { firstName: "Umed", lastName: "Khudoiberdiev" }, response => {
            expect(initializedUser).not.to.be.instanceOf(User);
            expect(initializedUser.lastName).to.exist;
            expect(response).to.have.status(200);
            expect(response.body.lastName).to.exist;
        });
    });

});
