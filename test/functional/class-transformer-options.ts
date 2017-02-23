import "reflect-metadata";
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
import { Expose, Transform, Type } from "class-transformer";
import {defaultMetadataStorage} from "class-transformer/storage";
import {ResponseClassTransformOptions} from "../../src/decorator/decorators";
const chakram = require("chakram");
const expect = chakram.expect;

describe("class transformer options", () => {

    class UserFilter {
        keyword: string;
    }

    class UserModel {
        id: number;
        _firstName: string;
        _lastName: string;

        @Type(() => Person)
        @Transform(value => ArrayUtil.toArray<Person>(value))
        person: Person[];

        @Expose()
        get name(): string {
            return this._firstName + " " + this._lastName;
        }
    }

    class Person {
        age: number;
        gender: string;
    }

    class ArrayUtil {
        public static toArray<T>(object: T): T[] {
            let obj = new Array<any>();

            if (!(object instanceof Array)) {
                obj.push(object);
            } else {
                obj = object;
            }

            return obj;
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
                _lastName: "Khudoiberdiev",
                name: "Umed Khudoiberdiev"
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
            classToPlainTransformOptions: {
                excludePrefixes: ["_"]
            },
            plainToClassTransformOptions: {
                excludePrefixes: ["__"]
            }
        };

        let expressApp: any, koaApp: any;
        before(done => expressApp = createExpressServer(options).listen(3001, done));
        after(done => expressApp.close(done));
        before(done => koaApp = createKoaServer(options).listen(3002, done));
        after(done => koaApp.close(done));

        assertRequest([3001, 3002], "get", "user?filter={\"keyword\": \"Um\", \"__somethingPrivate\": \"blablabla\"}", response => {
            expect(response).to.have.status(200);
            expect(response.body).to.be.eql({
                id: 1,
                name: "Umed Khudoiberdiev"
            });
            requestFilter.should.be.instanceOf(UserFilter);
            requestFilter.should.be.eql({
                keyword: "Um"
            });
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
                getUsers(@QueryParam("filter", { classTransformOptions: { excludePrefixes: ["__"] } }) filter: UserFilter): any {
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
                name: "Umed Khudoiberdiev"
            });
            requestFilter.should.be.instanceOf(UserFilter);
            requestFilter.should.be.eql({
                keyword: "Um"
            });
        });
    });

});
