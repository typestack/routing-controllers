import "reflect-metadata";
import {Controller} from "../../src/decorator/controllers";
import {Get, Post, Put, Patch, Delete, Head, Method} from "../../src/decorator/methods";
import {createServer, defaultMetadataArgsStorage} from "../../src/index";
import {
    Param, QueryParam, HeaderParam, CookieParam, Body, BodyParam, UploadedFile,
    UploadedFiles, Req, Res
} from "../../src/decorator/params";
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
        class UserPhotoController {

            @Get("/users")
            getUsers(@Req() request: any, @Res() response: any): any {
                requestReq = request;
                requestRes = response;
                return "";
            }

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

            @Get("/photos-with-required")
            getPhotosWithIdRequired(@QueryParam("limit", { required: true }) limit: number) {
                queryParamLimit = limit;
                return limit + "!";
            }

            @Get("/photos-with-json")
            getPhotosWithJsonParam(@QueryParam("filter", { parseJson: true }) filter: { keyword: string, limit: number }) {
                queryParamFilter = filter;
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

            @Get("/posts-with-required")
            getPostsWithIdRequired(@HeaderParam("limit", { required: true }) limit: number) {
                headerParamLimit = limit;
                return limit + "!";
            }

            @Get("/posts-with-json")
            getPostsWithJsonParam(@HeaderParam("filter", { parseJson: true }) filter: { keyword: string, limit: number }) {
                headerParamFilter = filter;
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

            @Get("/questions-with-required")
            getQuestionsWithIdRequired(@CookieParam("limit", { required: true }) limit: number) {
                cookieParamLimit = limit;
                return limit + "!";
            }

            @Get("/questions-with-json")
            getQuestionsWithJsonParam(@CookieParam("filter", { parseJson: true }) filter: { keyword: string, limit: number }) {
                cookieParamFilter = filter;
                return "";
            }

            @Post("/questions")
            postQuestion(@Body() question: string) {
                body = question;
                return body;
            }

            @Post("/questions-with-required")
            postRequiredQuestion(@Body({ required: true }) question: string) {
                body = question;
                return body;
            }

            @Post("/posts", { responseType: "json" })
            postPost(@Body() question: string) {
                body = question;
                return body;
            }

            @Post("/posts-with-required", { responseType: "json" })
            postRequiredPost(@Body({ required: true }) post: string) {
                body = post;
                return body;
            }

            @Post("/users", { responseType: "json" })
            postUser(@BodyParam("name") name: string, 
                     @BodyParam("age") age: number, 
                     @BodyParam("isActive") isActive: boolean): any {
                bodyParamName = name;
                bodyParamAge = age;
                bodyParamIsActive = isActive;
                return null;
            }

            @Post("/users-with-required", { responseType: "json" })
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
                return uploadedFileName;
            }

            @Post("/files-with-limit")
            postFileWithLimit(@UploadedFile("myfile", { uploadOptions: { limits: { fileSize: 2 } } }) file: any): any {
                return file.originalname;
            }

            @Post("/files-with-required")
            postFileWithRequired(@UploadedFile("myfile", { required: true }) file: any): any {
                return file.originalname;
            }

            @Post("/photos")
            postPhotos(@UploadedFiles("photos") files: any): any {
                uploadedFilesFirstName = files[0].originalname;
                uploadedFilesSecondName = files[1].originalname;
                return uploadedFilesFirstName + " " + uploadedFilesSecondName;
            }

            @Post("/photos-with-limit")
            postPhotosWithLimit(@UploadedFiles("photos", { uploadOptions: { limits: { files: 1 } } }) files: any): any {
                return files[0].originalname;
            }

            @Post("/photos-with-required")
            postPhotosWithRequired(@UploadedFiles("photos", { required: true }) files: any): any {
                return files[0].originalname;
            }

        }

    });

    let app: any;
    before(done => app = createServer().listen(3001, done));
    after(done => app.close(done));

    it("@Req and @Res should be provided as Request and Response objects", () => {
        return chakram
            .get("http://127.0.0.1:3001/users")
            .then((response: any) => {
                expect(requestReq).to.be.instanceOf(Object); // apply better check here
                expect(requestRes).to.be.instanceOf(Object); // apply better check here
                expect(response).to.be.status(200);
                expect(response).to.have.header("content-type", "text/html; charset=utf-8");
            });
    });

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

    it("for @QueryParam when required is params must be provided and they should not be empty", () => {
        return Promise.all([
            chakram
                .get("http://127.0.0.1:3001/photos-with-required/?limit=0")
                .then((response: any) => {
                    queryParamLimit.should.be.equal(0);
                    expect(response).to.be.status(200);
                    expect(response).to.have.header("content-type", "text/html; charset=utf-8");
                    expect(response.body).to.be.equal("0!");
                }),
            chakram
                .get("http://127.0.0.1:3001/photos-with-required/?")
                .then((response: any) => {
                    expect(response).to.be.status(500);
                }),
            chakram
                .get("http://127.0.0.1:3001/photos-with-required/?limit")
                .then((response: any) => {
                    expect(response).to.be.status(500);
                })
        ]);
    });

    it("for @QueryParam when parseJson flag is used query param must be converted to object", () => {
        return chakram
            .get("http://127.0.0.1:3001/photos-with-json/?filter={\"keyword\": \"name\", \"limit\": 5}")
            .then((response: any) => {
                queryParamFilter.should.be.eql({ keyword: "name", limit: 5 });
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

    it("for @HeaderParam when required is params must be provided and they should not be empty", () => {
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
        return Promise.all([
            chakram
                .get("http://127.0.0.1:3001/posts-with-required", validRequestOptions)
                .then((response: any) => {
                    headerParamLimit.should.be.equal(0);
                    expect(response).to.be.status(200);
                    expect(response).to.have.header("content-type", "text/html; charset=utf-8");
                }),
            chakram
                .get("http://127.0.0.1:3001/posts-with-required", invalidRequestOptions)
                .then((response: any) => {
                    expect(response).to.be.status(500);
                }),
            chakram
                .get("http://127.0.0.1:3001/posts-with-required")
                .then((response: any) => {
                    expect(response).to.be.status(500);
                })
        ]);
    });

    it("for @HeaderParam when parseJson flag is used query param must be converted to object", () => {
        const requestOptions = {
            headers: {
                filter: "{\"keyword\": \"name\", \"limit\": 5}"
            }
        };
        return chakram
            .get("http://127.0.0.1:3001/posts-with-json", requestOptions)
            .then((response: any) => {
                headerParamFilter.should.be.eql({ keyword: "name", limit: 5 });
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

    it("for @CookieParam when required is params must be provided and they should not be empty", () => {
        const request = require("request");
        const jar = request.jar();
        const url = "http://127.0.0.1:3001/questions-with-required";
        jar.setCookie(request.cookie("limit=20"), url);

        const validRequestOptions = { jar: jar };
        const invalidRequestOptions = { jar: request.jar() };
        return Promise.all([
            chakram
                .get(url, validRequestOptions)
                .then((response: any) => {
                    cookieParamLimit.should.be.equal(20);
                    expect(response).to.be.status(200);
                    expect(response).to.have.header("content-type", "text/html; charset=utf-8");
                }),
            chakram
                .get(url, invalidRequestOptions)
                .then((response: any) => {
                    expect(response).to.be.status(500);
                })
        ]);
    });

    it("for @CookieParam when parseJson flag is used query param must be converted to object", () => {
        const request = require("request");
        const jar = request.jar();
        const url = "http://127.0.0.1:3001/questions-with-json";
        jar.setCookie(request.cookie("filter={\"keyword\": \"name\", \"limit\": 5}"), url);
        const requestOptions = { jar: jar };
        
        return chakram
            .get(url, requestOptions)
            .then((response: any) => {
                cookieParamFilter.should.be.eql({ keyword: "name", limit: 5 });
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

    it("@Body should fail if required body was not provided", () => {
        const requestOptions = {
            headers: {
                "Content-type": "text/plain"
            },
            json: false
        };
        return Promise.all([
            chakram
                .post("http://127.0.0.1:3001/questions-with-required", "0", requestOptions)
                .then((response: any) => {
                    body.should.be.equal("0");
                    expect(response).to.be.status(200);
                    expect(response).to.have.header("content-type", "text/html; charset=utf-8");
                }),
            chakram
                .post("http://127.0.0.1:3001/questions-with-required", "", requestOptions)
                .then((response: any) => {
                    expect(response).to.be.status(500);
                }),
            chakram
                .post("http://127.0.0.1:3001/questions-with-required", undefined, requestOptions)
                .then((response: any) => {
                    expect(response).to.be.status(500);
                }),
        ])
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

    it("@Body should fail if required body was not provided for json-typed controllers and actions", () => {
        return Promise.all([
            chakram
                .post("http://127.0.0.1:3001/posts-with-required", { hello: "" })
                .then((response: any) => {
                    expect(response).to.be.status(200);
                }),
            chakram
                .post("http://127.0.0.1:3001/posts-with-required", undefined)
                .then((response: any) => {
                    expect(response).to.be.status(500);
                }),
        ])
    });

    it("@BodyParam should provide a json object for json-typed controllers and actions", () => {
        return chakram
            .post("http://127.0.0.1:3001/users", { name: "johny", age: 27, isActive: true })
            .then((response: any) => {
                bodyParamName.should.be.eql("johny");
                bodyParamAge.should.be.eql(27);
                bodyParamIsActive.should.be.eql(true);
                expect(response).to.be.status(200);
                expect(response).to.have.header("content-type", "application/json");
            });
    });

    it("@BodyParam should fail if required body was not provided for json-typed controllers and actions", () => {
        return Promise.all([
            chakram
                .post("http://127.0.0.1:3001/users-with-required",  { name: "johny", age: 27, isActive: true })
                .then((response: any) => {
                    expect(response).to.be.status(200);
                }),
            chakram
                .post("http://127.0.0.1:3001/users-with-required", undefined)
                .then((response: any) => {
                    expect(response).to.be.status(500);
                }),
            chakram
                .post("http://127.0.0.1:3001/users-with-required", { name: "", age: 27, isActive: false })
                .then((response: any) => {
                    expect(response).to.be.status(500);
                }),
            chakram
                .post("http://127.0.0.1:3001/users-with-required", { name: "Johny", age: 0, isActive: false })
                .then((response: any) => {
                    expect(response).to.be.status(200);
                }),
            chakram
                .post("http://127.0.0.1:3001/users-with-required", { name: "Johny", age: undefined, isActive: false })
                .then((response: any) => {
                    expect(response).to.be.status(500);
                }),
            chakram
                .post("http://127.0.0.1:3001/users-with-required", { name: "Johny", age: 27, isActive: undefined })
                .then((response: any) => {
                    expect(response).to.be.status(500);
                }),
            chakram
                .post("http://127.0.0.1:3001/users-with-required", { name: "Johny", age: 27, isActive: false })
                .then((response: any) => {
                    expect(response).to.be.status(200);
                }),
            chakram
                .post("http://127.0.0.1:3001/users-with-required", { name: "Johny", age: 27, isActive: true })
                .then((response: any) => {
                    expect(response).to.be.status(200);
                }),
        ])
    });

    it("@UploadedFile should provide uploaded file with the given name", () => {
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
        return chakram
            .post("http://127.0.0.1:3001/files", undefined, requestOptions)
            .then((response: any) => {
                uploadedFileName.should.be.eql("hello-world.txt");
                expect(response).to.be.status(200);
                expect(response).to.have.header("content-type", "text/html; charset=utf-8");
                expect(response.body).to.be.equal("hello-world.txt");
            });
    });

    it("@UploadedFile with passed uploading options (limit) should throw an error", () => {
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
        return Promise.all([
            chakram
                .post("http://127.0.0.1:3001/files-with-limit", undefined, validRequestOptions)
                .then((response: any) => {
                    expect(response).to.be.status(200);
                }),
            chakram
                .post("http://127.0.0.1:3001/files-with-limit", undefined, invalidRequestOptions)
                .then((response: any) => {
                    expect(response).to.be.status(500);
                }),
        ]);
    });

    it("for @UploadedFile when required is used files must be provided", () => {
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
        return Promise.all([
            chakram
                .post("http://127.0.0.1:3001/files-with-required", undefined, requestOptions)
                .then((response: any) => {
                    expect(response).to.be.status(200);
                }),
            chakram
                .post("http://127.0.0.1:3001/files-with-required", undefined, {})
                .then((response: any) => {
                    expect(response).to.be.status(500);
                }),
        ]);
    });

    it("@UploadedFiles should provide uploaded files with the given name", () => {
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
        return chakram
            .post("http://127.0.0.1:3001/photos", undefined, requestOptions)
            .then((response: any) => {
                uploadedFilesFirstName.should.be.eql("me.jpg");
                uploadedFilesSecondName.should.be.eql("she.jpg");
                expect(response).to.be.status(200);
                expect(response).to.have.header("content-type", "text/html; charset=utf-8");
                expect(response.body).to.be.equal("me.jpg she.jpg");
            });
    });

    it("@UploadedFiles with passed uploading options (limit) should throw an error", () => {
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
        return Promise.all([
            chakram
                .post("http://127.0.0.1:3001/photos-with-limit", undefined, validRequestOptions)
                .then((response: any) => {
                    expect(response).to.be.status(200);
                }),
            chakram
                .post("http://127.0.0.1:3001/photos-with-limit", undefined, invalidRequestOptions)
                .then((response: any) => {
                    expect(response).to.be.status(500);
                })
        ]);
    });

    it("for @UploadedFiles when required is used files must be provided", () => {
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
        return Promise.all([
            chakram
                .post("http://127.0.0.1:3001/photos-with-required", undefined, requestOptions)
                .then((response: any) => {
                    expect(response).to.be.status(200);
                }),
            chakram
                .post("http://127.0.0.1:3001/photos-with-required", undefined, {})
                .then((response: any) => {
                    expect(response).to.be.status(500);
                }),
            
        ]);
    });

});