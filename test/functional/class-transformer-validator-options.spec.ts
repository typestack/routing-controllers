import "reflect-metadata";
import {Length} from "class-validator";
import {JsonController} from "../../src/decorator/controllers";
import {Get} from "../../src/decorator/methods";
import {
    createExpressServer,
    defaultMetadataArgsStorage,
    createKoaServer,
    RoutingControllersOptions
} from "../../src/index";
import {QueryParam} from "../../src/decorator/params";
import {assertRequest} from "./test-utils";
import {Expose} from "class-transformer";
import {defaultMetadataStorage} from "class-transformer/storage";
import {ResponseClassTransformOptions} from "../../src/decorator/decorators";
const chakram = require("chakram");
const expect = chakram.expect;

describe("class transformer validator options", () => {

    class UserFilter {
        @Length(5, 15)
        keyword: string;
    }

    class UserModel {
        id: number;
        _firstName: string;
        _lastName: string;

        get name(): string {
            return this._firstName + " " + this._lastName;
        }
    }

    after(() => {
        defaultMetadataStorage.clear();
    });

    describe("should not use any options if not set", () => {

        let requestFilter: any;
        beforeEach(() => {
            requestFilter = undefined;
        });

        before(() => {
            defaultMetadataArgsStorage().reset();

            @JsonController()
            class UserController {

                @Get("/user")
                getUsers(@QueryParam("filter") filter: UserFilter): any {
                    requestFilter = filter;
                    const user = new UserModel();
                    user.id = 1;
                    user._firstName = "Umed";
                    user._lastName = "Khudoiberdiev";
                    return user;
                }

            }
        });

        let expressApp: any, koaApp: any;
        before(done => expressApp = createExpressServer().listen(3001, done));
        after(done => expressApp.close(done));
        before(done => koaApp = createKoaServer().listen(3002, done));
        after(done => koaApp.close(done));

        assertRequest([3001, 3002], "get", "user?filter={\"keyword\": \"Um\", \"__somethingPrivate\": \"blablabla\"}", response => {
            expect(response).to.have.status(200);
            expect(response.body).to.be.eql({
                id: 1,
                _firstName: "Umed",
                _lastName: "Khudoiberdiev"
            });
            requestFilter.should.be.instanceOf(UserFilter);
            requestFilter.should.be.eql({
                keyword: "Um",
                __somethingPrivate: "blablabla",
            });
        });
    });

    describe("should apply global options", () => {

        let requestFilter: any;
        beforeEach(() => {
            requestFilter = undefined;
        });

        before(() => {
            defaultMetadataArgsStorage().reset();

            @JsonController()
            class ClassTransformUserController {

                @Get("/user")
                getUsers(@QueryParam("filter") filter: UserFilter): any {
                    requestFilter = filter;
                    const user = new UserModel();
                    user.id = 1;
                    user._firstName = "Umed";
                    user._lastName = "Khudoiberdiev";
                    return user;
                }

            }
        });

        const options: RoutingControllersOptions = {
            useParamValidator: true,
            paramValidatorOptions: {
                transformer: {
                    excludePrefixes: ["_"]
                }
            }
        };

        let expressApp: any, koaApp: any;
        before(done => expressApp = createExpressServer(options).listen(3001, done));
        after(done => expressApp.close(done));
        before(done => koaApp = createKoaServer(options).listen(3002, done));
        after(done => koaApp.close(done));

        assertRequest([3001, 3002], "get", "user?filter={\"keyword\": \"Um\", \"__somethingPrivate\": \"blablabla\"}", response => {
            expect(response).to.have.status(400);
            expect(requestFilter).to.be.undefined;
        });
    });

    describe("should apply local options", () => {

        let requestFilter: any;
        beforeEach(() => {
            requestFilter = undefined;
        });

        before(() => {
            defaultMetadataArgsStorage().reset();

            @JsonController()
            class ClassTransformUserController {

                @Get("/user")
                @ResponseClassTransformOptions({ excludePrefixes: ["_"] })
                getUsers(@QueryParam("filter", { paramValidatorOptions: { transformer: { excludePrefixes: ["__"] } } }) filter: UserFilter): any {
                    requestFilter = filter;
                    const user = new UserModel();
                    user.id = 1;
                    user._firstName = "Umed";
                    user._lastName = "Khudoiberdiev";
                    return user;
                }

            }
        });

        const options: RoutingControllersOptions = {
            useParamValidator: true
        };

        let expressApp: any, koaApp: any;
        before(done => expressApp = createExpressServer(options).listen(3001, done));
        after(done => expressApp.close(done));
        before(done => koaApp = createKoaServer(options).listen(3002, done));
        after(done => koaApp.close(done));

        assertRequest([3001, 3002], "get", "user?filter={\"keyword\": \"Um\", \"__somethingPrivate\": \"blablabla\"}", response => {
            expect(response).to.have.status(400);
            expect(requestFilter).to.be.undefined;
        });
    });

});