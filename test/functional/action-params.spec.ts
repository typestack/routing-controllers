import "reflect-metadata";
import {Controller} from "../../src/decorator/controllers";
import {Get, Post, Put, Patch, Delete, Head, Method} from "../../src/decorator/methods";
import {createServer, defaultMetadataArgsStorage} from "../../src/index";
import {Param, QueryParam, HeaderParam, CookieParam, Body} from "../../src/decorator/params";
const chakram = require("chakram");
const expect = chakram.expect;

describe("Action Parameters > basic functionality", () => {

    let paramUserId: number, paramFirstId: number, paramSecondId: number;
    let queryParamSortBy: string, queryParamCount: string, queryParamLimit: number, queryParamShowAll: boolean;
    let headerParamToken: string, headerParamCount: number, headerParamShowAll: boolean;
    let cookieParamToken: string, cookieParamCount: number, cookieParamShowAll: boolean;
    let body: string;
    beforeEach(() => {
        paramUserId = undefined;
        paramFirstId = undefined;
        paramSecondId = undefined;
        queryParamSortBy = undefined;
        queryParamCount = undefined;
        queryParamLimit = undefined;
        queryParamShowAll = undefined;
        headerParamToken = undefined;
        headerParamCount = undefined;
        headerParamShowAll = undefined;
        cookieParamToken = undefined;
        cookieParamCount = undefined;
        cookieParamShowAll = undefined;
        body = undefined;
    });

    before(() => {

        // reset metadata args storage
        defaultMetadataArgsStorage().reset();

        @Controller()
        class UserPhotoController {

            @Get("/users/:userId")
            getUser(@Param("userId") userId: number) {
                paramUserId = userId;
                return userId + "!";
            }

            @Get("/users/:firstId/photos/:secondId")
            getUserPhoto(@Param("firstId") firstId: number,
                         @Param("secondId") secondId: number) {
                paramFirstId = firstId;
                paramSecondId = secondId;
                return firstId + "," + secondId;
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
                return "";
            }

            @Get("/posts")
            getPosts(@HeaderParam("token") token: string,
                     @HeaderParam("count") count: number,
                     @HeaderParam("showAll") showAll: boolean) {
                headerParamToken = token;
                headerParamCount = count;
                headerParamShowAll = showAll;
                return "";
            }

            @Get("/questions")
            getQuestions(@CookieParam("token") token: string,
                         @CookieParam("count") count: number,
                         @CookieParam("showAll") showAll: boolean) {
                cookieParamToken = token;
                cookieParamCount = count;
                cookieParamShowAll = showAll;
                return "";
            }

            @Post("/questions")
            postQuestion(@Body() question: string) {
                body = question;
                return body;
            }

            @Post("/posts", { responseType: "json" })
            postPost(@Body() question: string) {
                body = question;
                return body;
            }

        }

    });

    let app: any;
    before(done => app = createServer().listen(3001, done));
    after(done => app.close(done));

    it("@Param should give a param from route", () => {
        return chakram
            .get("http://127.0.0.1:3001/users/1")
            .then((response: any) => {
                paramUserId.should.be.equal(1);
                expect(response).to.be.status(200);
                expect(response).to.have.header("content-type", "text/html; charset=utf-8");
                expect(response.body).to.be.equal("1!");
            });
    });

    it("multiple @Param should give a proper values from route", () => {
        return chakram
            .get("http://127.0.0.1:3001/users/23/photos/32")
            .then((response: any) => {
                paramFirstId.should.be.equal(23);
                paramSecondId.should.be.equal(32);
                expect(response).to.be.status(200);
                expect(response).to.have.header("content-type", "text/html; charset=utf-8");
                expect(response.body).to.be.equal("23,32");
            });
    });

    it("@QueryParam should give a proper values from request query parameters", () => {
        return chakram
            .get("http://127.0.0.1:3001/photos?sortBy=name&count=2&limit=10&showAll=true")
            .then((response: any) => {
                queryParamSortBy.should.be.equal("name");
                queryParamCount.should.be.equal("2");
                queryParamLimit.should.be.equal(10);
                queryParamShowAll.should.be.equal(true);
                expect(response).to.be.status(200);
                expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            });
    });

    it("@QueryParam should give a proper values from request query parameters", () => {
        return chakram
            .get("http://127.0.0.1:3001/photos?sortBy=name&count=2&limit=10&showAll=true")
            .then((response: any) => {
                queryParamSortBy.should.be.equal("name");
                queryParamCount.should.be.equal("2");
                queryParamLimit.should.be.equal(10);
                queryParamShowAll.should.be.equal(true);
                expect(response).to.be.status(200);
                expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            });
    });

    it("@HeaderParam should give a proper values from request headers", () => {
        const requestOptions = {
            headers: {
                token: "31ds31das231sad12",
                count: 20,
                showAll: false
            }
        };
        return chakram
            .get("http://127.0.0.1:3001/posts", requestOptions)
            .then((response: any) => {
                headerParamToken.should.be.equal("31ds31das231sad12");
                headerParamCount.should.be.equal(20);
                headerParamShowAll.should.be.equal(false);
                expect(response).to.be.status(200);
                expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            });
    });

    it("@CookieParam should give a proper values from request headers", () => {
        const request = require("request");
        const jar = request.jar();
        const url = "http://127.0.0.1:3001/questions";
        jar.setCookie(request.cookie("token=31ds31das231sad12"), url);
        jar.setCookie(request.cookie("count=20"), url);
        jar.setCookie(request.cookie("showAll=false"), url);

        const requestOptions = {
            jar: jar
        };
        return chakram
            .get(url, requestOptions)
            .then((response: any) => {
                cookieParamToken.should.be.equal("31ds31das231sad12");
                cookieParamCount.should.be.equal(20);
                cookieParamShowAll.should.be.equal(false);
                expect(response).to.be.status(200);
                expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            });
    });

    it("@Body should provide a request body", () => {
        const requestOptions = {
            headers: {
                "Content-type": "text/plain"
            },
            json: false
        };
        return chakram
            .post("http://127.0.0.1:3001/questions", "hello", requestOptions)
            .then((response: any) => {
                body.should.be.equal("hello");
                expect(response).to.be.status(200);
                expect(response).to.have.header("content-type", "text/html; charset=utf-8");
                expect(response.body).to.be.equal(body);
            });
    });

    it("@Body should provide a json object for json-typed controllers and actions", () => {
        return chakram
            .post("http://127.0.0.1:3001/posts", { hello: "world" })
            .then((response: any) => {
                body.should.be.eql({ hello: "world" });
                expect(response).to.be.status(200);
                expect(response).to.have.header("content-type", "application/json; charset=utf-8");
                expect(response.body).to.be.eql(body); // should we allow to return a text body for json controllers?
            });
    });

});