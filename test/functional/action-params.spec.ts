import "reflect-metadata";

import {IsString, IsBoolean, Min, MaxLength, ValidateNested} from "class-validator";
import {getMetadataArgsStorage, createExpressServer, createKoaServer} from "../../src/index";
import {assertRequest} from "./test-utils";
import {User} from "../fakes/global-options/User";
import {Controller} from "../../src/decorator/Controller";
import {Get} from "../../src/decorator/Get";
import {Ctx} from "../../src/decorator/Ctx";
import {Req} from "../../src/decorator/Req";
import {Res} from "../../src/decorator/Res";
import {Param} from "../../src/decorator/Param";
import {Post} from "../../src/decorator/Post";
import {UseBefore} from "../../src/decorator/UseBefore";
import {Session} from "../../src/decorator/Session";
import {SessionParam} from "../../src/decorator/SessionParam";
import {State} from "../../src/decorator/State";
import {QueryParam} from "../../src/decorator/QueryParam";
import {QueryParams} from "../../src/decorator/QueryParams";
import {HeaderParam} from "../../src/decorator/HeaderParam";
import {CookieParam} from "../../src/decorator/CookieParam";
import {Body} from "../../src/decorator/Body";
import {BodyParam} from "../../src/decorator/BodyParam";
import {UploadedFile} from "../../src/decorator/UploadedFile";
import {UploadedFiles} from "../../src/decorator/UploadedFiles";
import {ContentType} from "../../src/decorator/ContentType";
import {JsonController} from "../../src/decorator/JsonController";

const chakram = require("chakram");
const expect = chakram.expect;

describe("action parameters", () => {

    let paramUserId: number, paramFirstId: number, paramSecondId: number;
    let sessionTestElement: string;
    let queryParamSortBy: string, queryParamCount: string, queryParamLimit: number, queryParamShowAll: boolean, queryParamFilter: any;
    let queryParams1: {[key: string]: any}, queryParams2: {[key: string]: any}, queryParams3: {[key: string]: any};
    let headerParamToken: string, headerParamCount: number, headerParamLimit: number, headerParamShowAll: boolean, headerParamFilter: any;
    let cookieParamToken: string, cookieParamCount: number, cookieParamLimit: number, cookieParamShowAll: boolean, cookieParamFilter: any;
    let body: string;
    let bodyParamName: string, bodyParamAge: number, bodyParamIsActive: boolean;
    let uploadedFileName: string;
    let uploadedFilesFirstName: string;
    let uploadedFilesSecondName: string;
    let requestReq: any, requestRes: any;

    beforeEach(() => {
        paramUserId = undefined;
        paramFirstId = undefined;
        paramSecondId = undefined;
        sessionTestElement = undefined;
        queryParamSortBy = undefined;
        queryParamCount = undefined;
        queryParamLimit = undefined;
        queryParamShowAll = undefined;
        queryParamFilter = undefined;
        queryParams1 = undefined;
        queryParams2 = undefined;
        queryParams3 = undefined;
        headerParamToken = undefined;
        headerParamCount = undefined;
        headerParamShowAll = undefined;
        headerParamLimit = undefined;
        headerParamFilter = undefined;
        cookieParamToken = undefined;
        cookieParamCount = undefined;
        cookieParamShowAll = undefined;
        cookieParamLimit = undefined;
        cookieParamFilter = undefined;
        body = undefined;
        bodyParamName = undefined;
        bodyParamAge = undefined;
        bodyParamIsActive = undefined;
        uploadedFileName = undefined;
        uploadedFilesFirstName = undefined;
        uploadedFilesSecondName = undefined;
        requestReq = undefined;
        requestRes = undefined;
    });

    before(() => {
        // reset metadata args storage
        getMetadataArgsStorage().reset();

        const {SetStateMiddleware} = require("../fakes/global-options/koa-middlewares/SetStateMiddleware");
        const {SessionMiddleware} = require("../fakes/global-options/SessionMiddleware");

        class NestedQueryClass {
            @Min(5)
            num: number;

            @IsString()
            str: string;

            @IsBoolean()
            isFive: boolean;
        }

        class QueryClass {
            @MaxLength(5)
            sortBy?: string;

            @IsString()
            count?: string;

            @Min(5)
            limit?: number;

            @IsBoolean()
            showAll: boolean = true;

            @ValidateNested()
            myObject: NestedQueryClass;
        }

        @Controller()
        class UserActionParamsController {

            @Get("/users")
            getUsers(@Req() request: any, @Res() response: any): any {
                requestReq = request;
                requestRes = response;
                return "<html><body>hello</body></html>";
            }

            @Get("/users-direct")
            getUsersDirect(@Res() response: any): any {
                if (typeof response.send === "function")
                    return response.status(201).contentType("custom/x-sample").send("hi, I was written directly to the response");
                else {
                    response.status = 201;
                    response.type = "custom/x-sample; charset=utf-8";
                    response.body = "hi, I was written directly to the response";
                    return response;
                }
            }

            @Get("/users-direct/ctx")
            getUsersDirectKoa(@Ctx() ctx: any): any {
                ctx.response.status = 201;
                ctx.response.type = "custom/x-sample; charset=utf-8";
                ctx.response.body = "hi, I was written directly to the response using Koa Ctx";
                return ctx;
            }

            @Get("/users/:userId")
            getUser(@Param("userId") userId: number) {
                paramUserId = userId;
                return `<html><body>${userId}</body></html>`;
            }

            @Get("/users/:firstId/photos/:secondId")
            getUserPhoto(@Param("firstId") firstId: number,
                         @Param("secondId") secondId: number) {
                paramFirstId = firstId;
                paramSecondId = secondId;
                return `<html><body>${firstId},${secondId}</body></html>`;
            }

            @Post("/session/")
            @UseBefore(SessionMiddleware)
            addToSession(@Session() session: any) {
                session["testElement"] = "@Session test";
                session["fakeObject"] = {
                    name: "fake",
                    fake: true,
                    value: 666
                };
                return `<html><body>@Session</body></html>`;
            }

            @Get("/session/")
            @UseBefore(SessionMiddleware)
            loadFromSession(@SessionParam("testElement") testElement: string) {
                sessionTestElement = testElement;
                return `<html><body>${testElement}</body></html>`;
            }

            @Get("/not-use-session/")
            notUseSession(@SessionParam("testElement") testElement: string) {
                sessionTestElement = testElement;
                return `<html><body>${testElement}</body></html>`;
            }

            @Get("/session-param-empty/")
            @UseBefore(SessionMiddleware)
            loadEmptyParamFromSession(@SessionParam("empty", { required: false }) emptyElement: string) {
                sessionTestElement = emptyElement;
                return `<html><body>${emptyElement === undefined}</body></html>`;
            }

            @Get("/session-param-empty-error/")
            @UseBefore(SessionMiddleware)
            errorOnLoadEmptyParamFromSession(@SessionParam("empty") emptyElement: string) {
                sessionTestElement = emptyElement;
                return `<html><body>${emptyElement === undefined}</body></html>`;
            }

            @Get("/state")
            @UseBefore(SetStateMiddleware)
            @ContentType("application/json")
            getState(@State() state: User) {
                return state;
            }

            @Get("/state/username")
            @UseBefore(SetStateMiddleware)
            getUsernameFromState(@State("username") username: string) {
                return `<html><body>${username}</body></html>`;
            }

            @Get("/photos")
            getPhotos(@QueryParam("sortBy") sortBy: string,
                      @QueryParam("count") count: string,
                      @QueryParam("limit") limit: number,
                      @QueryParam("showAll") showAll: boolean) {
                queryParamSortBy = sortBy;
                queryParamCount = count;
                queryParamLimit = limit;
                queryParamShowAll = showAll;
                return `<html><body>hello</body></html>`;
            }

            @Get("/photos-params")
            getPhotosWithQuery(@QueryParams() query: QueryClass) {
                queryParams1 = query;
                return `<html><body>hello</body></html>`;
            }

            @Get("/photos-params-no-validate")
            getPhotosWithQueryAndNoValidation(@QueryParams({ validate: false }) query: QueryClass) {
                queryParams2 = query;
                return `<html><body>hello</body></html>`;
            }

            @Get("/photos-params-optional")
            getPhotosWithOptionalQuery(@QueryParams({ validate: { skipMissingProperties: true } }) query: QueryClass) {
                queryParams3 = query;
                return `<html><body>hello</body></html>`;
            }

            @Get("/photos-with-required")
            getPhotosWithIdRequired(@QueryParam("limit", { required: true }) limit: number) {
                queryParamLimit = limit;
                return `<html><body>${limit}</body></html>`;
            }

            @Get("/photos-with-json")
            getPhotosWithJsonParam(@QueryParam("filter", { parse: true }) filter: { keyword: string, limit: number }) {
                queryParamFilter = filter;
                return `<html><body>hello</body></html>`;
            }

            @Get("/posts")
            getPosts(@HeaderParam("token") token: string,
                     @HeaderParam("count") count: number,
                     @HeaderParam("showAll") showAll: boolean) {
                headerParamToken = token;
                headerParamCount = count;
                headerParamShowAll = showAll;
                return `<html><body>hello</body></html>`;
            }

            @Get("/posts-with-required")
            getPostsWithIdRequired(@HeaderParam("limit", { required: true }) limit: number) {
                headerParamLimit = limit;
                return `<html><body>${limit}</body></html>`;
            }

            @Get("/posts-with-json")
            getPostsWithJsonParam(@HeaderParam("filter", { parse: true }) filter: { keyword: string, limit: number }) {
                headerParamFilter = filter;
                return `<html><body>hello</body></html>`;
            }

            @Get("/questions")
            getQuestions(@CookieParam("token") token: string,
                         @CookieParam("count") count: number,
                         @CookieParam("showAll") showAll: boolean) {
                cookieParamToken = token;
                cookieParamCount = count;
                cookieParamShowAll = showAll;
                return `<html><body>hello</body></html>`;
            }

            @Get("/questions-with-required")
            getQuestionsWithIdRequired(@CookieParam("limit", { required: true }) limit: number) {
                cookieParamLimit = limit;
                return `<html><body>hello</body></html>`;
            }

            @Get("/questions-with-json")
            getQuestionsWithJsonParam(@CookieParam("filter", { parse: true }) filter: { keyword: string, limit: number }) {
                cookieParamFilter = filter;
                return `<html><body>hello</body></html>`;
            }

            @Post("/questions")
            postQuestion(@Body() question: string) {
                body = question;
                return `<html><body>hello</body></html>`;
            }

            @Post("/questions-with-required")
            postRequiredQuestion(@Body({ required: true }) question: string) {
                body = question;
                return `<html><body>hello</body></html>`;
            }

            @Post("/files")
            postFile(@UploadedFile("myfile") file: any): any {
                uploadedFileName = file.originalname;
                return `<html><body>${uploadedFileName}</body></html>`;
            }

            @Post("/files-with-body")
            postFileWithBody(@UploadedFile("myfile") file: any, @Body() body: any): any {
                uploadedFileName = file.originalname;
                return `<html><body>${uploadedFileName} - ${JSON.stringify(body)}</body></html>`;
            }

            @Post("/files-with-body-param")
            postFileWithBodyParam(@UploadedFile("myfile") file: any, @BodyParam("p1") p1: string): any {
                uploadedFileName = file.originalname;
                return `<html><body>${uploadedFileName} - ${p1}</body></html>`;
            }

            @Post("/files-with-limit")
            postFileWithLimit(@UploadedFile("myfile", { options: { limits: { fileSize: 2 } } }) file: any): any {
                return `<html><body>${file.originalname}</body></html>`;
            }

            @Post("/files-with-required")
            postFileWithRequired(@UploadedFile("myfile", { required: true }) file: any): any {
                return `<html><body>${file.originalname}</body></html>`;
            }

            @Post("/photos")
            postPhotos(@UploadedFiles("photos") files: any): any {
                uploadedFilesFirstName = files[0].originalname;
                uploadedFilesSecondName = files[1].originalname;
                return `<html><body>${uploadedFilesFirstName} ${uploadedFilesSecondName}</body></html>`;
            }

            @Post("/photos-with-limit")
            postPhotosWithLimit(@UploadedFiles("photos", { options: { limits: { files: 1 } } }) files: any): any {
                return `<html><body>${files[0].originalname}</body></html>`;
            }

            @Post("/photos-with-required")
            postPhotosWithRequired(@UploadedFiles("photos", { required: true }) files: any): any {
                return `<html><body>${files[0].originalname}</body></html>`;
            }

        }

        @JsonController()
        class SecondUserActionParamsController {


            @Post("/posts")
            postPost(@Body() question: any) {
                body = question;
                return body;
            }

            @Post("/posts-with-required")
            postRequiredPost(@Body({ required: true }) post: string) {
                body = post;
                return body;
            }

            @Get("/posts-after")
            getPhotosAfter(@QueryParam("from", { required: true }) from: Date): any {
                return from.toISOString();
            }

            @Post("/users")
            postUser(@BodyParam("name") name: string,
                     @BodyParam("age") age: number,
                     @BodyParam("isActive") isActive: boolean): any {
                bodyParamName = name;
                bodyParamAge = age;
                bodyParamIsActive = isActive;
                return null;
            }

            @Post("/users-with-required")
            postUserWithRequired(@BodyParam("name", { required: true }) name: string,
                                 @BodyParam("age", { required: true }) age: number,
                                 @BodyParam("isActive", { required: true }) isActive: boolean): any {
                bodyParamName = name;
                bodyParamAge = age;
                bodyParamIsActive = isActive;
                return null;
            }
        }

    });

    let expressApp: any, koaApp: any;
    before(done => {
        expressApp = createExpressServer().listen(3001, done);
    });
    after(done => expressApp.close(done));
    before(done => {
        koaApp = createKoaServer();
        koaApp.keys = ["koa-session-secret"];
        koaApp = koaApp.listen(3002, done);
    });
    after(done => koaApp.close(done));

    describe("@Req and @Res should be provided as Request and Response objects", () => {
        assertRequest([3001, 3002], "get", "users", response => {
            expect(requestReq).to.be.instanceOf(Object); // apply better check here
            expect(requestRes).to.be.instanceOf(Object); // apply better check here
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
        });
    });

    describe("writing directly to the response using @Res should work", () => {
        assertRequest([3001, 3002], "get", "users-direct", response => {
            expect(response).to.be.status(201);
            expect(response.body).to.be.equal("hi, I was written directly to the response");
            expect(response).to.have.header("content-type", "custom/x-sample; charset=utf-8");
        });
    });

    describe("writing directly to the response using @Ctx should work", () => {
        assertRequest([3002], "get", "users-direct/ctx", response => {
            expect(response).to.be.status(201);
            expect(response.body).to.be.equal("hi, I was written directly to the response using Koa Ctx");
            expect(response).to.have.header("content-type", "custom/x-sample; charset=utf-8");
        });
    });

    describe("@Param should give a param from route", () => {
        assertRequest([3001, 3002], "get", "users/1", response => {
            expect(paramUserId).to.be.equal(1);
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            expect(response.body).to.be.equal("<html><body>1</body></html>");
        });
    });

    describe("multiple @Param should give a proper values from route", () => {
        assertRequest([3001, 3002], "get", "users/23/photos/32", response => {
            expect(paramFirstId).to.be.equal(23);
            expect(paramSecondId).to.be.equal(32);
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            expect(response.body).to.be.equal("<html><body>23,32</body></html>");
        });
    });

    describe("@Session middleware not use", () => {
        assertRequest([3001, 3002], "get", "not-use-session", response => {
            expect(response).to.be.status(500);
        });
    });

    describe("@Session should return a value from session", () => {
        assertRequest([3001, 3002], "post", "session", response => {
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            expect(response.body).to.be.equal("<html><body>@Session</body></html>");
            assertRequest([3001, 3002], "get", "session", response => {
                expect(response).to.be.status(200);
                expect(response).to.have.header("content-type", "text/html; charset=utf-8");
                expect(response.body).to.be.equal("<html><body>@Session test</body></html>");
                expect(sessionTestElement).to.be.equal("@Session test");
            });
        });
    });

    describe("@Session(param) should allow to inject empty property", () => {
        assertRequest([3001, 3002], "get", "session-param-empty", response => {
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            expect(response.body).to.be.equal("<html><body>true</body></html>");
            expect(sessionTestElement).to.be.undefined;
        });
    });

    // TODO: uncomment this after we get rid of calling `next(err)`

    // describe("@Session(param) should throw required error when param is empty", () => {
    //     assertRequest([3001, 3002], "get", "session-param-empty-error", response => {
    //         expect(response).to.be.status(400);
    //         // there should be a test for "ParamRequiredError" but chakram is the worst testing framework ever!!!
    //     });
    // });

    describe("@State should return a value from state", () => {
        assertRequest([3001], "get", "state", response => {
            expect(response).to.be.status(500);
        });
        assertRequest([3001], "get", "state/username", response => {
            expect(response).to.be.status(500);
        });
        assertRequest([3002], "get", "state", response => {
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "application/json");
            expect(response.body.username).to.be.equal("pleerock");
        });
        assertRequest([3002], "get", "state/username", response => {
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            expect(response.body).to.be.equal("<html><body>pleerock</body></html>");
        });
    });

    // todo: enable koa test when #227 fixed
    describe("@QueryParams should give a proper values from request's query parameters", () => {
        assertRequest([3001, /*3002*/], "get", "photos-params?sortBy=name&count=2&limit=10&showAll", response => {
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            expect(queryParams1.sortBy).to.be.equal("name");
            expect(queryParams1.count).to.be.equal("2");
            expect(queryParams1.limit).to.be.equal(10);
            expect(queryParams1.showAll).to.be.equal(true);
        });
    });

    describe("@QueryParams should give a proper values from request's query parameters with nested json", () => {
        assertRequest([3001, /*3002*/], "get", "photos-params?sortBy=name&count=2&limit=10&showAll&myObject=%7B%22num%22%3A%205,%20%22str%22%3A%20%22five%22,%20%22isFive%22%3A%20true%7D", response => {
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            expect(queryParams1.sortBy).to.be.equal("name");
            expect(queryParams1.count).to.be.equal("2");
            expect(queryParams1.limit).to.be.equal(10);
            expect(queryParams1.showAll).to.be.equal(true);
            expect(queryParams1.myObject.num).to.be.equal(5);
            expect(queryParams1.myObject.str).to.be.equal("five");
            expect(queryParams1.myObject.isFive).to.be.equal(true);
        });
    });

    describe("@QueryParams should not validate request query parameters when it's turned off in validator options", () => {
        assertRequest([3001, 3002], "get", "photos-params-no-validate?sortBy=verylongtext&count=2&limit=1&showAll=true", response => {
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            expect(queryParams2.sortBy).to.be.equal("verylongtext");
            expect(queryParams2.count).to.be.equal("2");
            expect(queryParams2.limit).to.be.equal(1);
            expect(queryParams2.showAll).to.be.equal(true);
        });
    });

    // todo: enable koa test when #227 fixed
    describe("@QueryParams should give a proper values from request's optional query parameters", () => {
        assertRequest([3001, /*3002*/], "get", "photos-params-optional?sortBy=name&limit=10", response => {
            expect(queryParams3.sortBy).to.be.equal("name");
            expect(queryParams3.count).to.be.equal(undefined);
            expect(queryParams3.limit).to.be.equal(10);
            expect(queryParams3.showAll).to.be.equal(true);
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
        });
    });

    describe("@QueryParam should give a proper values from request query parameters", () => {
        assertRequest([3001, 3002], "get", "photos?sortBy=name&count=2&limit=10&showAll=true", response => {
            expect(queryParamSortBy).to.be.equal("name");
            expect(queryParamCount).to.be.equal("2");
            expect(queryParamLimit).to.be.equal(10);
            expect(queryParamShowAll).to.be.equal(true);
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
        });
    });

    describe("for @QueryParam when required is params must be provided and they should not be empty", () => {
        assertRequest([3001, 3002], "get", "photos-with-required/?limit=0", response => {
            expect(queryParamLimit).to.be.equal(0);
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            expect(response.body).to.be.equal("<html><body>0</body></html>");
        });
        assertRequest([3001, 3002], "get", "photos-with-required/?", response => {
            expect(response).to.be.status(400);
        });
        assertRequest([3001, 3002], "get", "photos-with-required/?limit", response => {
            expect(response).to.be.status(400);
        });
    });

    describe("for @QueryParam when the type is Date then it should be parsed", () => {
        assertRequest([3001, 3002], "get", "posts-after/?from=2017-01-01T00:00:00Z", response => {
            expect(response).to.be.status(200);
            expect(response.body).to.be.equal("2017-01-01T00:00:00.000Z");
        });
    });

    describe("for @QueryParam when the type is Date and it is invalid then the response should be a BadRequest error", () => {
        assertRequest([3001, 3002], "get", "posts-after/?from=InvalidDate", response => {
            expect(response).to.be.status(400);
            expect(response.body.name).to.be.equals("ParamNormalizationError");
        });
    });

    describe("for @QueryParam when parseJson flag is used query param must be converted to object", () => {
        assertRequest([3001, 3002], "get", "photos-with-json/?filter={\"keyword\": \"name\", \"limit\": 5}", response => {
            expect(queryParamFilter).to.be.eql({ keyword: "name", limit: 5 });
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
        });
    });

    describe("@HeaderParam should give a proper values from request headers", () => {
        const requestOptions = {
            headers: {
                token: "31ds31das231sad12",
                count: 20,
                showAll: false
            }
        };
        assertRequest([3001, 3002], "get", "posts", requestOptions, response => {
            expect(headerParamToken).to.be.equal("31ds31das231sad12");
            expect(headerParamCount).to.be.equal(20);
            expect(headerParamShowAll).to.be.equal(false);
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
        });
    });

    describe("for @HeaderParam when required is params must be provided and they should not be empty", () => {
        const validRequestOptions = {
            headers: {
                limit: 0
            }
        };
        const invalidRequestOptions = {
            headers: {
                filter: ""
            }
        };
        assertRequest([3001, 3002], "get", "posts-with-required", validRequestOptions, response => {
            expect(headerParamLimit).to.be.equal(0);
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
        });
        assertRequest([3001, 3002], "get", "posts-with-required", invalidRequestOptions, response => {
            expect(response).to.be.status(400);
        });
        assertRequest([3001, 3002], "get", "posts-with-required", response => {
            expect(response).to.be.status(400);
        });
    });

    describe("for @HeaderParam when parseJson flag is used query param must be converted to object", () => {
        const requestOptions = {
            headers: {
                filter: "{\"keyword\": \"name\", \"limit\": 5}"
            }
        };
        assertRequest([3001, 3002], "get", "posts-with-json", requestOptions, response => {
            expect(headerParamFilter).to.be.eql({ keyword: "name", limit: 5 });
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
        });
    });

    describe("@CookieParam should give a proper values from request headers", () => {
        const request = require("request");
        const jar = request.jar();
        const url2 = "http://127.0.0.1:3002/questions";
        jar.setCookie(request.cookie("token=31ds31das231sad12"), url2);
        jar.setCookie(request.cookie("count=20"), url2);
        jar.setCookie(request.cookie("showAll=false"), url2);

        const requestOptions = {
            jar: jar
        };
        assertRequest([3001, 3002], "get", "questions", requestOptions, response => {
            expect(cookieParamToken).to.be.equal("31ds31das231sad12");
            expect(cookieParamCount).to.be.equal(20);
            expect(cookieParamShowAll).to.be.equal(false);
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
        });
    });

    describe("for @CookieParam when required is params must be provided and they should not be empty", () => {
        const request = require("request");
        const jar = request.jar();
        const url = "http://127.0.0.1:3001/questions-with-required";
        jar.setCookie(request.cookie("limit=20"), url);

        const validRequestOptions = { jar: jar };
        const invalidRequestOptions = { jar: request.jar() };

        assertRequest([3001, 3002], "get", "questions-with-required", validRequestOptions, response => {
            expect(cookieParamLimit).to.be.equal(20);
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
        });

        assertRequest([3001, 3002], "get", "questions-with-required", invalidRequestOptions, response => {
            expect(response).to.be.status(400);
        });
    });

    describe("for @CookieParam when parseJson flag is used query param must be converted to object", () => {
        const request = require("request");
        const jar = request.jar();
        const url = "http://127.0.0.1:3001/questions-with-json";
        jar.setCookie(request.cookie("filter={\"keyword\": \"name\", \"limit\": 5}"), url);
        const requestOptions = { jar: jar };

        assertRequest([3001, 3002], "get", "questions-with-json", requestOptions, response => {
            expect(cookieParamFilter).to.be.eql({ keyword: "name", limit: 5 });
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
        });
    });

    describe("@Body should provide a request body", () => {
        const requestOptions = {
            headers: {
                "Content-type": "text/plain"
            },
            json: false
        };

        // todo: koa @Body with text bug. uncomment after fix https://github.com/koajs/bodyparser/issues/52
        assertRequest([3001/*, 3002*/], "post", "questions", "hello", requestOptions, response => {
            expect(body).to.be.equal("hello");
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
        });
    });

    // todo: koa @Body with text bug. uncomment after fix https://github.com/koajs/bodyparser/issues/52
    describe("@Body should fail if required body was not provided", () => {
        const requestOptions = {
            headers: {
                "Content-type": "text/plain"
            },
            json: false
        };

        assertRequest([3001/*, 3002*/], "post", "questions-with-required", "0", requestOptions, response => {
            expect(body).to.be.equal("0");
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
        });

        assertRequest([3001, 3002], "post", "questions-with-required", "", requestOptions, response => {
            expect(response).to.be.status(400);
        });

        assertRequest([3001, 3002], "post", "questions-with-required", undefined, requestOptions, response => {
            expect(response).to.be.status(400);
        });
    });

    describe("@Body should provide a json object for json-typed controllers and actions", () => {
        assertRequest([3001, 3002], "post", "posts", { hello: "world" }, response => {
            expect(body).to.be.eql({ hello: "world" });
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "application/json; charset=utf-8");
            expect(response.body).to.be.eql(body); // should we allow to return a text body for json controllers?
        });
    });

    describe("@Body should fail if required body was not provided for json-typed controllers and actions", () => {
        assertRequest([3001, 3002], "post", "posts-with-required", { hello: "" }, response => {
            expect(response).to.be.status(200);
        });
        assertRequest([3001, 3002], "post", "posts-with-required", undefined, response => {
            expect(response).to.be.status(400);
        });
    });

    describe("@BodyParam should provide a json object for json-typed controllers and actions", () => {
        assertRequest([3001, 3002], "post", "users", { name: "johny", age: 27, isActive: true }, response => {
            expect(bodyParamName).to.be.eql("johny");
            expect(bodyParamAge).to.be.eql(27);
            expect(bodyParamIsActive).to.be.eql(true);
            expect(response).to.be.status(204);
        });
    });

    describe("@BodyParam should fail if required body was not provided for json-typed controllers and actions", () => {

        assertRequest([3001, 3002], "post", "users-with-required", { name: "johny", age: 27, isActive: true }, response => {
            expect(response).to.be.status(204);
        });
        assertRequest([3001, 3002], "post", "users-with-required", undefined, response => {
            expect(response).to.be.status(400);
        });
        assertRequest([3001, 3002], "post", "users-with-required", { name: "", age: 27, isActive: false }, response => {
            expect(response).to.be.status(400);
        });
        assertRequest([3001, 3002], "post", "users-with-required", { name: "Johny", age: 0, isActive: false }, response => {
            expect(response).to.be.status(204);
        });
        assertRequest([3001, 3002], "post", "users-with-required", { name: "Johny", age: undefined, isActive: false }, response => {
            expect(response).to.be.status(400);
        });
        assertRequest([3001, 3002], "post", "users-with-required", { name: "Johny", age: 27, isActive: undefined }, response => {
            expect(response).to.be.status(400);
        });
        assertRequest([3001, 3002], "post", "users-with-required", { name: "Johny", age: 27, isActive: false }, response => {
            expect(response).to.be.status(204);
        });
        assertRequest([3001, 3002], "post", "users-with-required", { name: "Johny", age: 27, isActive: true }, response => {
            expect(response).to.be.status(204);
        });
    });

    describe("@UploadedFile should provide uploaded file with the given name", () => {
        const requestOptions = {
            formData: {
                myfile: {
                    value: "hello world",
                    options: {
                        filename: "hello-world.txt",
                        contentType: "image/text"
                    }
                }
            }
        };

        assertRequest([3001, 3002], "post", "files", undefined, requestOptions, response => {
            expect(uploadedFileName).to.be.eql("hello-world.txt");
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            expect(response.body).to.be.equal("<html><body>hello-world.txt</body></html>");
        });
    });

    describe("@UploadedFile with @Body should return both the file and the body", () => {
        const requestOptions = {
            formData: {
                myfile: {
                    value: "hello world",
                    options: {
                        filename: "hello-world.txt",
                        contentType: "image/text"
                    }
                },
                anotherField: "hi",
                andOther: "hello",
            }
        };

        assertRequest([3001, 3002], "post", "files-with-body", undefined, requestOptions, response => {
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            expect(response.body).to.be.equal(`<html><body>hello-world.txt - {"anotherField":"hi","andOther":"hello"}</body></html>`);
        });
    });

    describe("@UploadedFile with @BodyParam should return both the file and the body param", () => {
        const requestOptions = {
            formData: {
                myfile: {
                    value: "hello world",
                    options: {
                        filename: "hello-world.txt",
                        contentType: "image/text"
                    }
                },
                p1: "hi, i'm a param",
            }
        };

        assertRequest([3001, 3002], "post", "files-with-body-param", undefined, requestOptions, response => {
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            expect(response.body).to.be.equal("<html><body>hello-world.txt - hi, i'm a param</body></html>");
        });
    });

    describe("@UploadedFile with passed uploading options (limit) should throw an error", () => {
        const validRequestOptions = {
            formData: {
                myfile: {
                    value: "a",
                    options: {
                        filename: "hello-world.txt",
                        contentType: "image/text"
                    }
                }
            }
        };
        const invalidRequestOptions = {
            formData: {
                myfile: {
                    value: "hello world",
                    options: {
                        filename: "hello-world.txt",
                        contentType: "image/text"
                    }
                }
            }
        };

        assertRequest([3001, 3002], "post", "files-with-limit", undefined, validRequestOptions, response => {
            expect(response).to.be.status(200);
        });

        assertRequest([3001, 3002], "post", "files-with-limit", undefined, invalidRequestOptions, response => {
            expect(response).to.be.status(500);
        });
    });

    describe("for @UploadedFile when required is used files must be provided", () => {
        const requestOptions = {
            formData: {
                myfile: {
                    value: "hello world",
                    options: {
                        filename: "hello-world.txt",
                        contentType: "image/text"
                    }
                }
            }
        };

        assertRequest([3001, 3002], "post", "files-with-required", undefined, requestOptions, response => {
            expect(response).to.be.status(200);
        });

        assertRequest([3001, 3002], "post", "files-with-required", undefined, {}, response => {
            expect(response).to.be.status(400);
        });
    });

    describe("@UploadedFiles should provide uploaded files with the given name", () => {
        const requestOptions = {
            formData: {
                photos: [{
                    value: "0110001",
                    options: {
                        filename: "me.jpg",
                        contentType: "image/jpg"
                    }
                }, {
                    value: "10011010",
                    options: {
                        filename: "she.jpg",
                        contentType: "image/jpg"
                    }
                }]
            }
        };

        assertRequest([3001, 3002], "post", "photos", undefined, requestOptions, response => {
            expect(uploadedFilesFirstName).to.be.eql("me.jpg");
            expect(uploadedFilesSecondName).to.be.eql("she.jpg");
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            expect(response.body).to.be.equal("<html><body>me.jpg she.jpg</body></html>");
        });
    });

    describe("@UploadedFiles with passed uploading options (limit) should throw an error", () => {
        const validRequestOptions = {
            formData: {
                photos: [{
                    value: "0110001",
                    options: {
                        filename: "me.jpg",
                        contentType: "image/jpg"
                    }
                }]
            }
        };
        const invalidRequestOptions = {
            formData: {
                photos: [{
                    value: "0110001",
                    options: {
                        filename: "me.jpg",
                        contentType: "image/jpg"
                    }
                }, {
                    value: "10011010",
                    options: {
                        filename: "she.jpg",
                        contentType: "image/jpg"
                    }
                }]
            }
        };

        assertRequest([3001, 3002], "post", "photos-with-limit", undefined, validRequestOptions, response => {
            expect(response).to.be.status(200);
        });
        assertRequest([3001, 3002], "post", "photos-with-limit", undefined, invalidRequestOptions, response => {
            expect(response).to.be.status(500);
        });
    });

    describe("for @UploadedFiles when required is used files must be provided", () => {
        const requestOptions = {
            formData: {
                photos: [{
                    value: "0110001",
                    options: {
                        filename: "me.jpg",
                        contentType: "image/jpg"
                    }
                }, {
                    value: "10011010",
                    options: {
                        filename: "she.jpg",
                        contentType: "image/jpg"
                    }
                }]
            }
        };

        assertRequest([3001, 3002], "post", "photos-with-required", undefined, requestOptions, response => {
            expect(response).to.be.status(200);
        });
        assertRequest([3001, 3002], "post", "photos-with-required", undefined, {}, response => {
            expect(response).to.be.status(400);
        });

    });

});