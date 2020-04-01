import "reflect-metadata";
import {Get} from "../../src/decorator/Get";
import {createExpressServer, getMetadataArgsStorage, NotAcceptableError} from "../../src/index";
import {JsonController} from "../../src/decorator/JsonController";
import {Authorized} from "../../src/decorator/Authorized";
import {Action} from "../../src/Action";
import {Server as HttpServer} from "http";
import DoneCallback = jest.DoneCallback;
import {AxiosError, AxiosResponse} from "axios";
import HttpStatusCodes from "http-status-codes";
import {axios} from "../utilities/axios";

const sleep = (time: number): Promise<void> => new Promise(resolve => setTimeout(resolve, time));

describe("Controller responds with value when Authorization succeeds (async)", () => {
    let expressServer: HttpServer;

    beforeEach((done: DoneCallback) => {
        getMetadataArgsStorage().reset();

        @JsonController()
        class AuthController {
            @Authorized()
            @Get("/auth1")
            auth1(): any {
                return {test: "auth1"};
            }

            @Authorized(["role1"])
            @Get("/auth2")
            auth2(): any {
                return {test: "auth2"};
            }

            @Authorized()
            @Get("/auth3")
            async auth3(): Promise<any> {
                await sleep(10);
                return {test: "auth3"};
            }
        }

        expressServer = createExpressServer({
            authorizationChecker: async (action: Action, roles?: string[]) => {
                await sleep(10);
                return true;
            }
        }).listen(3001, done);
    });

    afterEach(done => expressServer.close(done));

    it("without roles", () => {
        expect.assertions(2);
        return axios.get("/auth1")
            .then((response: AxiosResponse) => {
                expect(response.status).toEqual(HttpStatusCodes.OK);
                expect(response.data).toEqual({test: "auth1"});
            });
    });

    it("with roles", () => {
        expect.assertions(2);
        return axios.get("/auth2")
            .then((response: AxiosResponse) => {
                expect(response.status).toEqual(HttpStatusCodes.OK);
                expect(response.data).toEqual({test: "auth2"});
            });
    });

    it("async", () => {
        expect.assertions(2);
        return axios.get("/auth3")
            .then((response: AxiosResponse) => {
                expect(response.status).toEqual(HttpStatusCodes.OK);
                expect(response.data).toEqual({test: "auth3"});
            });
    });
});

describe("Controller responds with value when Authorization succeeds (sync)", () => {
    let expressServer: HttpServer;

    beforeEach((done: DoneCallback) => {
        getMetadataArgsStorage().reset();

        @JsonController()
        class AuthController {
            @Authorized()
            @Get("/auth1")
            auth1(): any {
                return {test: "auth1"};
            }

            @Authorized(["role1"])
            @Get("/auth2")
            auth2(): any {
                return {test: "auth2"};
            }

            @Authorized()
            @Get("/auth3")
            async auth3(): Promise<any> {
                await sleep(10);
                return {test: "auth3"};
            }
        }

        expressServer = createExpressServer({
            authorizationChecker: (action: Action, roles?: string[]) => {
                return true;
            }
        }).listen(3001, done);
    });

    afterEach(done => expressServer.close(done));

    it("without roles", () => {
        expect.assertions(2);
        return axios.get("/auth1")
            .then((response: AxiosResponse) => {
                expect(response.status).toEqual(HttpStatusCodes.OK);
                expect(response.data).toEqual({test: "auth1"});
            });
    });

    it("with roles", () => {
        expect.assertions(2);
        return axios.get("/auth2")
            .then((response: AxiosResponse) => {
                expect(response.status).toEqual(HttpStatusCodes.OK);
                expect(response.data).toEqual({test: "auth2"});
            });
    });

    it("async", () => {
        expect.assertions(2);
        return axios.get("/auth3")
            .then((response: AxiosResponse) => {
                expect(response.status).toEqual(200);
                expect(response.data).toEqual({test: "auth3"});
            });
    });
});

describe("Authorized Decorators Http Status Code", () => {
    let expressServer: HttpServer;

    beforeEach((done: DoneCallback) => {
        getMetadataArgsStorage().reset();

        @JsonController()
        class AuthController {
            @Authorized()
            @Get("/auth1")
            auth1(): any {
                return {test: "auth1"};
            }

            @Authorized(["role1"])
            @Get("/auth2")
            auth2(): any {
                return {test: "auth2"};
            }
        }

        expressServer = createExpressServer({
            authorizationChecker: (action: Action, roles?: string[]) => {
                return false;
            }
        }).listen(3001, done);
    });

    afterEach(done => expressServer.close(done));

    it("without roles", () => {
        expect.assertions(1);
        return axios.get("/auth1")
            .catch((error: AxiosError) => {
                expect(error.response.status).toEqual(HttpStatusCodes.UNAUTHORIZED);
            });
    });

    it("with roles", () => {
        expect.assertions(1);
        return axios.get("/auth2")
            .catch((error: AxiosError) => {
                expect(error.response.status).toEqual(HttpStatusCodes.FORBIDDEN);
            });
    });
});

describe("Authorization checker allows to throw (async)", () => {
    let expressServer: HttpServer;

    beforeEach((done: DoneCallback) => {
        getMetadataArgsStorage().reset();

        @JsonController()
        class AuthController {
            @Authorized()
            @Get("/auth1")
            auth1(): any {
                return {test: "auth1"};
            }
        }

        expressServer = createExpressServer({
            authorizationChecker: (action: Action, roles?: string[]) => {
                throw new NotAcceptableError("Custom Error");
            }
        }).listen(3001, done);
    });

    afterEach(done => expressServer.close(done));

    it("custom errors", () => {
        expect.assertions(3);
        return axios.get("/auth1")
            .catch((error: AxiosError) => {
                expect(error.response.status).toEqual(HttpStatusCodes.NOT_ACCEPTABLE);
                expect(error.response.data).toHaveProperty("name", "NotAcceptableError");
                expect(error.response.data).toHaveProperty("message", "Custom Error");
            });
    });
});

describe("Authorization checker allows to throw (sync)", () => {
    let expressServer: HttpServer;

    beforeEach((done: DoneCallback) => {
        // reset metadata args storage
        getMetadataArgsStorage().reset();

        @JsonController()
        class AuthController {
            @Authorized()
            @Get("/auth1")
            auth1(): any {
                return {test: "auth1"};
            }
        }

        expressServer = createExpressServer({
            authorizationChecker: (action: Action, roles?: string[]) => {
                throw new NotAcceptableError("Custom Error");
            }
        }).listen(3001, done);
    });

    afterEach(done => expressServer.close(done));

    it("custom errors", () => {
        expect.assertions(3);
        return axios.get("/auth1")
            .catch((error: AxiosError) => {
                expect(error.response.status).toEqual(HttpStatusCodes.NOT_ACCEPTABLE);
                expect(error.response.data).toHaveProperty("name", "NotAcceptableError");
                expect(error.response.data).toHaveProperty("message", "Custom Error");
            });
    });
});
