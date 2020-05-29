import "reflect-metadata";
import {Exclude, Expose} from "class-transformer";
import {defaultMetadataStorage} from "class-transformer/storage";
import {JsonController} from "../../src/decorator/JsonController";
import {Post} from "../../src/decorator/Post";
import {Body} from "../../src/decorator/Body";
import {createExpressServer, createKoaServer, getMetadataArgsStorage} from "../../src/index";
import {assertRequest} from "./test-utils";
const expect = require("chakram").expect;

describe("action options", () => {

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
            ret.lastName = user.lastName || "default";
            return ret;
        }

        @JsonController("", {transformResponse: false})
        class NoTransformResponseController {
            @Post("/default")
            default(@Body() user: UserModel) {
                return handler(user);
            }

            @Post("/transformRequestOnly", {transformRequest: true, transformResponse: false})
            transformRequestOnly(@Body() user: UserModel) {
                return handler(user);
            }

            @Post("/transformResponseOnly", {transformRequest: false, transformResponse: true})
            transformResponseOnly(@Body() user: UserModel) {
                return handler(user);
            }
        }
    });

    let expressApp: any, koaApp: any;
    before(done => expressApp = createExpressServer().listen(3001, done));
    after(done => expressApp.close(done));
    before(done => koaApp = createKoaServer().listen(3002, done));
    after(done => koaApp.close(done));

    it("should use controller options when action transform options are not set", () => {
        assertRequest([3001, 3002], "post", "default", { firstName: "Umed", lastName: "Khudoiberdiev" }, response => {
            expect(initializedUser).to.be.instanceOf(User);
            expect(initializedUser.lastName).to.be.undefined;
            expect(response).to.have.status(200);
            expect(response.body.lastName).to.equal("default");
        });
    });

    it("should override controller options with action transformRequest option", () => {
        assertRequest([3001, 3002], "post", "transformRequestOnly", { firstName: "Umed", lastName: "Khudoiberdiev" }, response => {
            expect(initializedUser).to.be.instanceOf(User);
            expect(initializedUser.lastName).to.be.undefined;
            expect(response).to.have.status(200);
            expect(response.body.lastName).to.equal("default");
        });
    });

    it("should override controller options with action transformResponse option", () => {
        assertRequest([3001, 3002], "post", "transformResponseOnly", { firstName: "Umed", lastName: "Khudoiberdiev" }, response => {
            expect(initializedUser).not.to.be.instanceOf(User);
            expect(initializedUser.lastName).to.exist;
            expect(response).to.have.status(200);
            expect(response.body.lastName).to.be.undefined;
        });
    });
});
