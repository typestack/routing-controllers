import "reflect-metadata";
import {Length} from "class-validator";
import {JsonController} from "../../src/decorator/JsonController";
import {createExpressServer, getMetadataArgsStorage} from "../../src/index";
import {defaultMetadataStorage} from "class-transformer/storage";
import {Get} from "../../src/decorator/Get";
import {QueryParam} from "../../src/decorator/QueryParam";
import {ResponseClassTransformOptions} from "../../src/decorator/ResponseClassTransformOptions";
import DoneCallback = jest.DoneCallback;
import {AxiosError, AxiosResponse} from "axios";
import {Server as HttpServer} from "http";
import qs from "qs";
import HttpStatusCodes from "http-status-codes";
import {axios} from "../utilities/axios";

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

afterAll(() => defaultMetadataStorage.clear());

describe("global validation enabled", () => {
    let expressServer: HttpServer;
    let requestFilter: UserFilter;

    beforeEach((done: DoneCallback) => {
        requestFilter = undefined;
        getMetadataArgsStorage().reset();

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

        expressServer = createExpressServer({
            validation: true
        }).listen(3001, done);
    });

    afterEach((done: DoneCallback) => {
        expressServer.close(done);
    });

    it("should apply global validation enabled", () => {
        expect.assertions(2);
        return axios.get("/user?" + qs.stringify({
            filter: {
                keyword: "Um",
                __somethingPrivate: "blablabla"
            }
        })).catch((error: AxiosError) => {
            expect(error.response.status).toEqual(HttpStatusCodes.BAD_REQUEST);
            expect(requestFilter).toBeUndefined();
        });
    });
});

describe("local validation enabled", () => {
    let expressServer: HttpServer;
    let requestFilter: UserFilter;

    beforeEach((done: DoneCallback) => {
        requestFilter = undefined;
        getMetadataArgsStorage().reset();

        @JsonController()
        class ClassTransformUserController {
            @Get("/user")
            @ResponseClassTransformOptions({excludePrefixes: ["_"]})
            getUsers(@QueryParam("filter", {validate: true}) filter: UserFilter): any {
                requestFilter = filter;
                const user = new UserModel();
                user.id = 1;
                user._firstName = "Umed";
                user._lastName = "Khudoiberdiev";
                return user;
            }
        }

        expressServer = createExpressServer().listen(3001, done);
    });

    afterEach((done: DoneCallback) => expressServer.close(done));

    it("should apply local validation enabled", () => {
        expect.assertions(2);
        return axios.get("/user?" + qs.stringify({
            filter: {
                keyword: "Um",
                __somethingPrivate: "blablabla"
            }
        })).catch((error: AxiosError) => {
            expect(error.response.status).toEqual(HttpStatusCodes.BAD_REQUEST);
            expect(requestFilter).toBeUndefined();
        });
    });

});

describe("global validation options", () => {
    let expressServer: HttpServer;
    let requestFilter: any;

    beforeEach((done: DoneCallback) => {
        requestFilter = undefined;
        getMetadataArgsStorage().reset();

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

        expressServer = createExpressServer({
            validation: {
                skipMissingProperties: true
            }
        }).listen(3001, done);
    });

    afterEach((done: DoneCallback) => expressServer.close(done));

    it("should apply global validation options", () => {
        expect.assertions(2);
        return axios.get("/user?" + qs.stringify({
            filter: {
                notKeyword: "Um",
                __somethingPrivate: "blablabla"
            }
        })).then((response: AxiosResponse) => {
            expect(response.status).toEqual(HttpStatusCodes.OK);
            expect(requestFilter).toHaveProperty("notKeyword");
        });
    });
});

describe("valid param after validation", () => {
    let expressServer: HttpServer;
    let requestFilter: UserFilter;

    beforeEach((done: DoneCallback) => {
        requestFilter = undefined;
        getMetadataArgsStorage().reset();

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

        expressServer = createExpressServer({
            validation: true
        }).listen(3001, done);
    });

    afterEach((done: DoneCallback) => expressServer.close(done));

    it("should pass the valid param after validation", () => {
        expect.assertions(4);
        return axios.get("/user?" + qs.stringify({
            filter: {
                keyword: "Umedi",
                __somethingPrivate: "blablabla"
            }
        })).then((response: AxiosResponse) => {
            expect(response.status).toEqual(HttpStatusCodes.OK);
            expect(response.data).toEqual({
                id: 1,
                _firstName: "Umed",
                _lastName: "Khudoiberdiev"
            });
            expect(requestFilter).toBeInstanceOf(UserFilter);
            expect(requestFilter).toEqual({
                keyword: "Umedi",
                __somethingPrivate: "blablabla",
            });
        });
    });
});

describe("param name on validation failed", () => {
    let expressServer: HttpServer;
    let requestFilter: any;

    beforeEach((done: DoneCallback) => {
        requestFilter = undefined;
        getMetadataArgsStorage().reset();

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

        expressServer = createExpressServer({
            validation: true
        }).listen(3001, done);
    });

    afterEach((done: DoneCallback) => expressServer.close(done));

    it("should contain param name on validation failed", () => {
        expect.assertions(2);
        return axios.get("/user?" + qs.stringify({
            filter: {
                keyword: "aa"
            }
        })).catch((error: AxiosError) => {
            expect(error.response.status).toEqual(HttpStatusCodes.BAD_REQUEST);
            expect(error.response.data.paramName).toEqual("filter");
        });
    });
});
