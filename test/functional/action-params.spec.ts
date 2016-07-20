import "reflect-metadata";
import {Controller} from "../../src/decorator/controllers";
import {Get, Post} from "../../src/decorator/methods";
import {createExpressServer, defaultMetadataArgsStorage, createKoaServer} from "../../src/index";
import {
    Param,
    QueryParam,
    HeaderParam,
    CookieParam,
    Body,
    BodyParam,
    UploadedFile,
    UploadedFiles,
    Req,
    Res
} from "../../src/decorator/params";
import {assertRequest} from "./test-utils";
import {JsonResponse} from "../../src/decorator/decorators";
const chakram = require("chakram");
const expect = chakram.expect;

describe("action parameters", () => {

    let paramUserId: number, paramFirstId: number, paramSecondId: number;
    let queryParamSortBy: string, queryParamCount: string, queryParamLimit: number, queryParamShowAll: boolean, queryParamFilter: any;
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
        queryParamSortBy = undefined;
        queryParamCount = undefined;
        queryParamLimit = undefined;
        queryParamShowAll = undefined;
        queryParamFilter = undefined;
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
        defaultMetadataArgsStorage().reset();

        @Controller()
        class UserActionParamsController {

            @Get("/users")
            getUsers(@Req() request: any, @Res() response: any): any {
                requestReq = request;
                requestRes = response;
                return "<html><body>hello</body></html>";
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

            @Get("/photos-with-required")
            getPhotosWithIdRequired(@QueryParam("limit", { required: true }) limit: number) {
                queryParamLimit = limit;
                return `<html><body>${limit}</body></html>`;
            }

            @Get("/photos-with-json")
            getPhotosWithJsonParam(@QueryParam("filter", { parseJson: true }) filter: { keyword: string, limit: number }) {
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
            getPostsWithJsonParam(@HeaderParam("filter", { parseJson: true }) filter: { keyword: string, limit: number }) {
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
            getQuestionsWithJsonParam(@CookieParam("filter", { parseJson: true }) filter: { keyword: string, limit: number }) {
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

            @Post("/posts")
            @JsonResponse()
            postPost(@Body() question: string) {
                body = question;
                return body;
            }

            @Post("/posts-with-required")
            @JsonResponse()
            postRequiredPost(@Body({ required: true }) post: string) {
                body = post;
                return body;
            }

            @Post("/users")
            @JsonResponse()
            postUser(@BodyParam("name") name: string, 
                     @BodyParam("age") age: number, 
                     @BodyParam("isActive") isActive: boolean): any {
                bodyParamName = name;
                bodyParamAge = age;
                bodyParamIsActive = isActive;
                return null;
            }

            @Post("/users-with-required")
            @JsonResponse()
            postUserWithRequired(@BodyParam("name", { required: true }) name: string, 
                                 @BodyParam("age", { required: true }) age: number, 
                                 @BodyParam("isActive", { required: true }) isActive: boolean): any {
                bodyParamName = name;
                bodyParamAge = age;
                bodyParamIsActive = isActive;
                return null;
            }

            @Post("/files")
            postFile(@UploadedFile("myfile") file: any): any {
                uploadedFileName = file.originalname;
                return `<html><body>${uploadedFileName}</body></html>`;
            }

            @Post("/files-with-limit")
            postFileWithLimit(@UploadedFile("myfile", { uploadOptions: { limits: { fileSize: 2 } } }) file: any): any {
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
            postPhotosWithLimit(@UploadedFiles("photos", { uploadOptions: { limits: { files: 1 } } }) files: any): any {
                return `<html><body>${files[0].originalname}</body></html>`;
            }

            @Post("/photos-with-required")
            postPhotosWithRequired(@UploadedFiles("photos", { required: true }) files: any): any {
                return `<html><body>${files[0].originalname}</body></html>`;
            }

        }

    });

    let expressApp: any, koaApp: any;
    before(done => expressApp = createExpressServer().listen(3001, done));
    after(done => expressApp.close(done));
    before(done => koaApp = createKoaServer().listen(3002, done));
    after(done => koaApp.close(done));

    describe("@Req and @Res should be provided as Request and Response objects", () => {
        assertRequest([3001, 3002], "get", "users", response => {
            expect(requestReq).to.be.instanceOf(Object); // apply better check here
            expect(requestRes).to.be.instanceOf(Object); // apply better check here
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
        });
    });

    describe("@Param should give a param from route", () => {
        assertRequest([3001, 3002], "get", "users/1", response => {
            paramUserId.should.be.equal(1);
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            expect(response.body).to.be.equal("<html><body>1</body></html>");
        });
    });

    describe("multiple @Param should give a proper values from route", () => {
        assertRequest([3001, 3002], "get", "users/23/photos/32", response => {
            paramFirstId.should.be.equal(23);
            paramSecondId.should.be.equal(32);
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            expect(response.body).to.be.equal("<html><body>23,32</body></html>");
        });
    });

    describe("@QueryParam should give a proper values from request query parameters", () => {
        assertRequest([3001, 3002], "get", "photos?sortBy=name&count=2&limit=10&showAll=true", response => {
            queryParamSortBy.should.be.equal("name");
            queryParamCount.should.be.equal("2");
            queryParamLimit.should.be.equal(10);
            queryParamShowAll.should.be.equal(true);
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
        });
    });

    describe("for @QueryParam when required is params must be provided and they should not be empty", () => {
        assertRequest([3001, 3002], "get", "photos-with-required/?limit=0", response => {
            queryParamLimit.should.be.equal(0);
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            expect(response.body).to.be.equal("<html><body>0</body></html>");
        });
        assertRequest([3001, 3002], "get", "photos-with-required/?", response => {
            expect(response).to.be.status(500);
        });
        assertRequest([3001, 3002], "get", "photos-with-required/?limit", response => {
            expect(response).to.be.status(500);
        });
    });

    describe("for @QueryParam when parseJson flag is used query param must be converted to object", () => {
        assertRequest([3001, 3002], "get", "photos-with-json/?filter={\"keyword\": \"name\", \"limit\": 5}", response => {
            queryParamFilter.should.be.eql({ keyword: "name", limit: 5 });
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
            headerParamToken.should.be.equal("31ds31das231sad12");
            headerParamCount.should.be.equal(20);
            headerParamShowAll.should.be.equal(false);
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
            headerParamLimit.should.be.equal(0);
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
        });
        assertRequest([3001, 3002], "get", "posts-with-required", invalidRequestOptions, response => {
            expect(response).to.be.status(500);
        });
        assertRequest([3001, 3002], "get", "posts-with-required", response => {
            expect(response).to.be.status(500);
        });
    });

    describe("for @HeaderParam when parseJson flag is used query param must be converted to object", () => {
        const requestOptions = {
            headers: {
                filter: "{\"keyword\": \"name\", \"limit\": 5}"
            }
        };
        assertRequest([3001, 3002], "get", "posts-with-json", requestOptions, response => {
            headerParamFilter.should.be.eql({ keyword: "name", limit: 5 });
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
            cookieParamToken.should.be.equal("31ds31das231sad12");
            cookieParamCount.should.be.equal(20);
            cookieParamShowAll.should.be.equal(false);
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
            cookieParamLimit.should.be.equal(20);
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
        });

        assertRequest([3001, 3002], "get", "questions-with-required", invalidRequestOptions, response => {
            expect(response).to.be.status(500);
        });
    });

    describe("for @CookieParam when parseJson flag is used query param must be converted to object", () => {
        const request = require("request");
        const jar = request.jar();
        const url = "http://127.0.0.1:3001/questions-with-json";
        jar.setCookie(request.cookie("filter={\"keyword\": \"name\", \"limit\": 5}"), url);
        const requestOptions = { jar: jar };

        assertRequest([3001, 3002], "get", "questions-with-json", requestOptions, response => {
            cookieParamFilter.should.be.eql({ keyword: "name", limit: 5 });
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

        assertRequest([3001, 3002], "post", "questions", "hello", requestOptions, response => {
            body.should.be.equal("hello");
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
        });
    });

    describe("@Body should fail if required body was not provided", () => {
        const requestOptions = {
            headers: {
                "Content-type": "text/plain"
            },
            json: false
        };

        assertRequest([3001, 3002], "post", "questions-with-required", "0", requestOptions, response => {
            body.should.be.equal("0");
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
        });

        assertRequest([3001, 3002], "post", "questions-with-required", "", requestOptions, response => {
            expect(response).to.be.status(500);
        });

        assertRequest([3001, 3002], "post", "questions-with-required", undefined, requestOptions, response => {
            expect(response).to.be.status(500);
        });
    });

    describe("@Body should provide a json object for json-typed controllers and actions", () => {
        assertRequest([3001, 3002], "post", "posts", { hello: "world" }, response => {
            body.should.be.eql({ hello: "world" });
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
            expect(response).to.be.status(500);
        });
    });

    describe("@BodyParam should provide a json object for json-typed controllers and actions", () => {
        assertRequest([3001, 3002], "post", "users", { name: "johny", age: 27, isActive: true }, response => {
            bodyParamName.should.be.eql("johny");
            bodyParamAge.should.be.eql(27);
            bodyParamIsActive.should.be.eql(true);
            expect(response).to.be.status(204);
        });
    });

    describe("@BodyParam should fail if required body was not provided for json-typed controllers and actions", () => {

        assertRequest([3001, 3002], "post", "users-with-required", { name: "johny", age: 27, isActive: true }, response => {
            expect(response).to.be.status(204);
        });
        assertRequest([3001, 3002], "post", "users-with-required", undefined, response => {
            expect(response).to.be.status(500);
        });
        assertRequest([3001, 3002], "post", "users-with-required", { name: "", age: 27, isActive: false }, response => {
            expect(response).to.be.status(500);
        });
        assertRequest([3001, 3002], "post", "users-with-required", { name: "Johny", age: 0, isActive: false }, response => {
            expect(response).to.be.status(204);
        });
        assertRequest([3001, 3002], "post", "users-with-required", { name: "Johny", age: undefined, isActive: false }, response => {
            expect(response).to.be.status(500);
        });
        assertRequest([3001, 3002], "post", "users-with-required", { name: "Johny", age: 27, isActive: undefined }, response => {
            expect(response).to.be.status(500);
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

        assertRequest([3001/*, 3002*/], "post", "files", undefined, requestOptions, response => {
            // uploadedFileName.should.be.eql("hello-world.txt");
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            expect(response.body).to.be.equal("<html><body>hello-world.txt</body></html>");
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

        assertRequest([3001/*, 3002*/], "post", "files-with-limit", undefined, validRequestOptions, response => {
            expect(response).to.be.status(200);
        });

        assertRequest([3001/*, 3002*/], "post", "files-with-limit", undefined, invalidRequestOptions, response => {
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

        assertRequest([3001/*, 3002*/], "post", "files-with-required", undefined, requestOptions, response => {
            expect(response).to.be.status(200);
        });

        assertRequest([3001/*, 3002*/], "post", "files-with-required", undefined, {}, response => {
            expect(response).to.be.status(500);
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

        assertRequest([3001/*, 3002*/], "post", "photos", undefined, requestOptions, response => {
            uploadedFilesFirstName.should.be.eql("me.jpg");
            uploadedFilesSecondName.should.be.eql("she.jpg");
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

        assertRequest([3001/*, 3002*/], "post", "photos-with-limit", undefined, validRequestOptions, response => {
            expect(response).to.be.status(200);
        });
        assertRequest([3001/*, 3002*/], "post", "photos-with-limit", undefined, invalidRequestOptions, response => {
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

        assertRequest([3001/*, 3002*/], "post", "photos-with-required", undefined, requestOptions, response => {
            expect(response).to.be.status(200);
        });
        assertRequest([3001/*, 3002*/], "post", "photos-with-required", undefined, {}, response => {
            expect(response).to.be.status(500);
        });
        
    });

});